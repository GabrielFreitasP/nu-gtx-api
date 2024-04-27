import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

@Controller('api')
@ApiTags('API')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Verifica a situação da API' })
  @ApiResponse({ status: 200, description: 'API em execução' })
  getApiStatus(): { status: string } {
    return this.appService.getApiStatus();
  }
}
