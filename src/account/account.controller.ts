import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthRolesEnum } from '../auth/enums/auth-roles.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../commons/decorators/roles.decorator';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { ResponseAccountDto } from './dto/response-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('/api/v1/accounts')
@ApiTags('Contas')
@ApiBearerAuth()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @HttpCode(201)
  @ApiBody({ type: CreateAccountDto })
  @ApiOperation({ summary: 'Cria nova conta' })
  @ApiResponse({
    status: 201,
    description: 'Conta criada',
    type: ResponseAccountDto,
  })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão de acesso' })
  @ApiResponse({ status: 409, description: 'Conta já existe' })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AuthRolesEnum.ADMIN)
  create(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<ResponseAccountDto> {
    return this.accountService.create(createAccountDto);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Busca lista de contas' })
  @ApiResponse({
    status: 200,
    description: 'Contas encontradas',
    type: ResponseAccountDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão de acesso' })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AuthRolesEnum.ADMIN, AuthRolesEnum.USER)
  findAll(): Promise<ResponseAccountDto[]> {
    return this.accountService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AuthRolesEnum.ADMIN, AuthRolesEnum.USER)
  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Busca conta pelo id' })
  @ApiResponse({ status: 200, description: 'Conta encontrada' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão de acesso' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  findOne(@Param('id') id: string): Promise<ResponseAccountDto> {
    return this.accountService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiBody({ type: UpdateAccountDto })
  @ApiOperation({ summary: 'Atualiza conta pelo id' })
  @ApiResponse({
    status: 200,
    description: 'Conta atualizado',
    type: ResponseAccountDto,
  })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão de acesso' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AuthRolesEnum.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<ResponseAccountDto> {
    return this.accountService.update(id, updateAccountDto);
  }
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Deleta conta pelo id' })
  @ApiResponse({ status: 204, description: 'Conta deletado' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão de acesso' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AuthRolesEnum.ADMIN)
  remove(@Param('id') id: string): Promise<void> {
    return this.accountService.remove(id);
  }
}
