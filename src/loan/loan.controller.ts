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
import { CreateLoanDto } from './dto/create-loan.dto';
import { ResponseLoanDto } from './dto/response-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { LoanService } from './loan.service';

@Controller('/api/v1/loans')
@ApiTags('Empréstimos')
@ApiBearerAuth()
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post()
  @HttpCode(201)
  @ApiBody({ type: CreateLoanDto })
  @ApiOperation({ summary: 'Cria novo empréstimo' })
  @ApiResponse({
    status: 201,
    description: 'Empréstimo criado',
    type: ResponseLoanDto,
  })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão de acesso' })
  @ApiResponse({ status: 409, description: 'Empréstimo já existe' })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AuthRolesEnum.ADMIN)
  create(@Body() createLoanDto: CreateLoanDto): Promise<ResponseLoanDto> {
    return this.loanService.create(createLoanDto);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Busca lista de empréstimos' })
  @ApiResponse({
    status: 200,
    description: 'Empréstimos encontrados',
    type: ResponseLoanDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão de acesso' })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AuthRolesEnum.ADMIN, AuthRolesEnum.USER)
  findAll(): Promise<ResponseLoanDto[]> {
    return this.loanService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AuthRolesEnum.ADMIN, AuthRolesEnum.USER)
  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Busca empréstimo pelo id' })
  @ApiResponse({ status: 200, description: 'Empréstimo encontrado' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão de acesso' })
  @ApiResponse({ status: 404, description: 'Empréstimo não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  findOne(@Param('id') id: string): Promise<ResponseLoanDto> {
    return this.loanService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiBody({ type: UpdateLoanDto })
  @ApiOperation({ summary: 'Atualiza empréstimo pelo id' })
  @ApiResponse({
    status: 200,
    description: 'Empréstimo atualizado',
    type: ResponseLoanDto,
  })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão de acesso' })
  @ApiResponse({ status: 404, description: 'Empréstimo não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AuthRolesEnum.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateLoanDto: UpdateLoanDto,
  ): Promise<ResponseLoanDto> {
    return this.loanService.update(id, updateLoanDto);
  }
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Deleta empréstimo pelo id' })
  @ApiResponse({ status: 204, description: 'Empréstimo deletado' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão de acesso' })
  @ApiResponse({ status: 404, description: 'Empréstimo não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AuthRolesEnum.ADMIN)
  remove(@Param('id') id: string): Promise<void> {
    return this.loanService.remove(id);
  }
}
