import { Controller, Get, Render, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/strategy/auth.guard';
import { EndpointService } from './endpoint.service';

@Controller('/endpoint')
export class EndpointController {
  constructor(private endpointService: EndpointService) {}

  @Get('/ranking')
  @UseGuards(new AuthGuard())
  @Render('ranking')
  async ranking() {
    return await this.endpointService.getStatistic();
  }
}
