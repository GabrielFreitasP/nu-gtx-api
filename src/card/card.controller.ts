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
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { ResponseCardDto } from './dto/response-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Controller('/api/v1/cards')
@ApiTags('Cartões')
@ApiBearerAuth()
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @HttpCode(201)
  @ApiBody({ type: CreateCardDto })
  @ApiOperation({ summary: 'Cria novo cartão' })
  @ApiResponse({
    status: 201,
    description: 'Cartão criado',
    type: ResponseCardDto,
  })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão de acesso' })
  @ApiResponse({ status: 409, description: 'Cartão já existe' })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AuthRolesEnum.ADMIN)
  create(@Body() createCardDto: CreateCardDto): Promise<ResponseCardDto> {
    return this.cardService.create(createCardDto);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Busca lista de cartões' })
  @ApiResponse({
    status: 200,
    description: 'Cartões encontrados',
    type: ResponseCardDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão de acesso' })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AuthRolesEnum.ADMIN, AuthRolesEnum.USER)
  findAll(): Promise<ResponseCardDto[]> {
    return this.cardService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AuthRolesEnum.ADMIN, AuthRolesEnum.USER)
  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Busca cartão pelo id' })
  @ApiResponse({ status: 200, description: 'Cartão encontrado' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão de acesso' })
  @ApiResponse({ status: 404, description: 'Cartão não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  findOne(@Param('id') id: string): Promise<ResponseCardDto> {
    return this.cardService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiBody({ type: UpdateCardDto })
  @ApiOperation({ summary: 'Atualiza cartão pelo id' })
  @ApiResponse({
    status: 200,
    description: 'Cartão atualizado',
    type: ResponseCardDto,
  })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão de acesso' })
  @ApiResponse({ status: 404, description: 'Cartão não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AuthRolesEnum.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateCardDto: UpdateCardDto,
  ): Promise<ResponseCardDto> {
    return this.cardService.update(id, updateCardDto);
  }
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Deleta cartão pelo id' })
  @ApiResponse({ status: 204, description: 'Cartão deletado' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão de acesso' })
  @ApiResponse({ status: 404, description: 'Cartão não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AuthRolesEnum.ADMIN)
  remove(@Param('id') id: string): Promise<void> {
    return this.cardService.remove(id);
  }
}
