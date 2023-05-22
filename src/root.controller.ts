import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class RootController {
  @Get(['', 'redirect'])
  @Redirect('cats/page/1')
  root() {
    return;
  }
}
