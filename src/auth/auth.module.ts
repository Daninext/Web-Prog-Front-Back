import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  Type,
} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../user/users.service';
import { UsersModule } from '../user/users.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigInjectionToken } from './config.interface';
import { SupertokensService } from './supertokens/supertokens.service';
import { AuthMiddleware } from './auth/auth.middleware';
import { AuthConfigService } from '../auth.config.service';

@Module({
  imports: [UsersModule, PassportModule],
  controllers: [AuthController],
  providers: [UsersService, AuthService],
  exports: [],
})
export class AuthModule {
  static forRoot(config: Type<AuthConfigService>): DynamicModule {
    const options = new config().createOptions();
    return {
      providers: [
        {
          useValue: options,
          provide: ConfigInjectionToken,
        },
        SupertokensService,
      ],
      exports: [],
      imports: [],
      module: AuthModule,
    };
  }
}
