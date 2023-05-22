import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { urlencoded, json } from 'express';
import supertokens from 'supertokens-node';
import { SupertokensExceptionFilter } from './auth/auth/auth.filter';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session from 'supertokens-node/recipe/session';
import { middleware } from 'supertokens-node/framework/express';
import Dashboard from 'supertokens-node/recipe/dashboard';

async function bootstrap() {
  supertokens.init({
    framework: 'express',
    supertokens: {
      connectionURI: process.env.CONNECTION_URI,
      apiKey: process.env.API_KEY,
    },
    appInfo: {
      appName: 'new-web',
      apiDomain: 'http://localhost:200',
      websiteDomain: 'http://localhost:200',
      apiBasePath: '/auth',
      websiteBasePath: '/auth',
    },
    recipeList: [EmailPassword.init(), Session.init(), Dashboard.init()],
  });

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(middleware());
  app.enableCors({
    origin: ['http://localhost:200'],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Cats gallery')
    .setDescription('The cats gallery API.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('pug');
  app.use(cookieParser());
  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '5mb' }));

  app.useGlobalFilters(new SupertokensExceptionFilter());
  if ('PORT' in process.env) {
    await app.listen(process.env.PORT);
  } else {
    await app.listen(3000);
  }
}
bootstrap();
