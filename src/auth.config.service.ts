import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthConfigService {
  createOptions() {
    return {
      connectionURI: process.env.CONNECTION_URI,
      apiKey: process.env.API_KEY,
      appInfo: {
        appName: 'new-web',
        apiDomain: 'http://localhost:200/api',
        websiteDomain: 'http://localhost:200',
        apiBasePath: '/auth',
        websiteBasePath: '/auth',
      },
    };
  }
}
