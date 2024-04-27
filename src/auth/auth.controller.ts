import { Request, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserEntity } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { RequestLoginDto } from './dto/request-login.dto';
import { ResponseLoginDto } from './dto/response-login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('api/v1/auth')
@ApiTags('Autenticação')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Realiza a autenticação na API' })
  @ApiBody({ type: RequestLoginDto })
  @ApiResponse({
    status: 200,
    description: 'Access token',
    type: ResponseLoginDto,
  })
  async login(
    @Request() { user }: { user: UserEntity },
  ): Promise<ResponseLoginDto> {
    return this.authService.login(user);
  }
}
