import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  getWelcomePage(): string {
    return this.appService.getWelcomeHtml();
  }

  @Public()
  @Get('health')
  getHealth() {
    return this.appService.getHealthStatus();
  }

  @Public()
  @Get('welcome')
  getWelcomeJson() {
    return this.appService.getWelcomeData();
  }

  @Public()
  @Get('api')
  getApiRoot() {
    return this.appService.getWelcomeData();
  }

  // Backward compatibility for existing unit tests
  getHello(): string {
    return this.appService.getHello();
  }
}
