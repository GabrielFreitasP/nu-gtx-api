import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LoggerService } from '../commons/logger/logger.service';
import { CreateCardDto } from './dto/create-card.dto';
import { ResponseCardDto } from './dto/response-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardEntity } from './entities/card.entity';

@Injectable()
export class CardService {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(CardEntity)
    private readonly repository: Repository<CardEntity>,
  ) {}

  async create(createCardDto: CreateCardDto): Promise<ResponseCardDto> {
    try {
      this.logger.debug(
        `Criando cartão '${createCardDto.number} | ${createCardDto.number}'.`,
      );

      let card = new CardEntity(createCardDto);
      card = await this.repository.save(card);

      this.logger.info(`Cartão '${card.number}' criado.`);

      return ResponseCardDto.fromEntity(card);
    } catch (error) {
      if (error.code === '23505') {
        this.logger.warn(`Cartão '${createCardDto.number}' já existe.`);
        throw new ConflictException(
          `Card '${createCardDto.number}' already exists`,
        );
      }

      this.logger.error(
        `Erro ao criar cartão '${createCardDto.number}': '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to create card');
    }
  }

  async findAll(): Promise<ResponseCardDto[]> {
    try {
      this.logger.debug(`Buscando cartões.`);

      const cards = await this.repository.find();

      this.logger.debug(`${cards.length} cartões encontrados.`);

      return cards.map((card) => ResponseCardDto.fromEntity(card));
    } catch (error) {
      this.logger.error(`Erro ao buscar lista de cartões: '${error.message}'.`);
      throw new InternalServerErrorException('Error to find all cards');
    }
  }

  async findOne(id: string): Promise<ResponseCardDto> {
    try {
      this.logger.debug(`Buscando cartão pelo id '${id}'.`);

      const card = await this.repository.findOneBy({ id });

      if (!card) {
        this.logger.warn(`Nenhum cartão encontrado pelo id '${id}'.`);
        throw new NotFoundException('Card not found');
      }

      this.logger.debug(`Cartão '${card.number}' encontrado pelo id '${id}'.`);

      return ResponseCardDto.fromEntity(card);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Erro ao buscar cartão pelo id '${id}': '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to find one card');
    }
  }

  async update(
    id: string,
    updateCardDto: UpdateCardDto,
  ): Promise<ResponseCardDto> {
    try {
      this.logger.debug(`Atualizando cartão pelo id '${id}'.`);

      let card = await this.repository.findOneBy({ id });

      if (!card) {
        this.logger.warn(`Nenhum cartão encontrado pelo id '${id}'.`);
        throw new NotFoundException('Card not found');
      }

      card = new CardEntity({ ...card, ...updateCardDto });
      card = await this.repository.save(card);

      this.logger.info(`Cartão '${card.id}' atualizado.`);

      return ResponseCardDto.fromEntity(card);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Erro ao atualizar cartão pelo id '${id}': '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to update card');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.logger.debug(`Deletando cartão pelo id '${id}'.`);

      const card = await this.repository.findOneBy({ id });

      if (!card) {
        this.logger.warn(`Nenhum cartão encontrado pelo id '${id}'.`);
        throw new NotFoundException('Card not found');
      }

      await this.repository.softDelete(id);

      this.logger.info(`Cartão '${card.number}' deletado.`);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Erro ao deletar cartão pelo id '${id}': '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to remove card');
    }
  }
}
