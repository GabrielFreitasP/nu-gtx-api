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
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { ResponseInvoiceDto } from './dto/response-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceService } from './invoice.service';

@Controller('/api/v1/invoices')
@ApiTags('Faturas')
@ApiBearerAuth()
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @HttpCode(201)
  @ApiBody({ type: CreateInvoiceDto })
  @ApiOperation({ summary: 'Cria nova fatura' })
  @ApiResponse({
    status: 201,
    description: 'Fatura criada',
    type: ResponseInvoiceDto,
  })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão de acesso' })
  @ApiResponse({ status: 409, description: 'Fatura já existe' })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AuthRolesEnum.ADMIN)
  create(
    @Body() createInvoiceDto: CreateInvoiceDto,
  ): Promise<ResponseInvoiceDto> {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Busca lista de faturas' })
  @ApiResponse({
    status: 200,
    description: 'Faturas encontradas',
    type: ResponseInvoiceDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão de acesso' })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AuthRolesEnum.ADMIN, AuthRolesEnum.USER)
  findAll(): Promise<ResponseInvoiceDto[]> {
    return this.invoiceService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AuthRolesEnum.ADMIN, AuthRolesEnum.USER)
  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Busca fatura pelo id' })
  @ApiResponse({ status: 200, description: 'Fatura encontrada' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão de acesso' })
  @ApiResponse({ status: 404, description: 'Fatura não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  findOne(@Param('id') id: string): Promise<ResponseInvoiceDto> {
    return this.invoiceService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiBody({ type: UpdateInvoiceDto })
  @ApiOperation({ summary: 'Atualiza fatura pelo id' })
  @ApiResponse({
    status: 200,
    description: 'Fatura atualizado',
    type: ResponseInvoiceDto,
  })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão de acesso' })
  @ApiResponse({ status: 404, description: 'Fatura não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AuthRolesEnum.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<ResponseInvoiceDto> {
    return this.invoiceService.update(id, updateInvoiceDto);
  }
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Deleta fatura pelo id' })
  @ApiResponse({ status: 204, description: 'Fatura deletado' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão de acesso' })
  @ApiResponse({ status: 404, description: 'Fatura não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AuthRolesEnum.ADMIN)
  remove(@Param('id') id: string): Promise<void> {
    return this.invoiceService.remove(id);
  }
}
