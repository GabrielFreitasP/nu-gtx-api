import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LoggerService } from '../commons/logger/logger.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { ResponseInvoiceDto } from './dto/response-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceEntity } from './entities/invoice.entity';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(InvoiceEntity)
    private readonly repository: Repository<InvoiceEntity>,
  ) {}

  async create(
    createInvoiceDto: CreateInvoiceDto,
  ): Promise<ResponseInvoiceDto> {
    try {
      this.logger.debug(`Criando fatura '${createInvoiceDto.dueDate}'.`);

      let invoice = new InvoiceEntity(createInvoiceDto);
      invoice = await this.repository.save(invoice);

      this.logger.info(`Fatura '${invoice.dueDate}' criada.`);

      return ResponseInvoiceDto.fromEntity(invoice);
    } catch (error) {
      if (error.code === '23505') {
        this.logger.warn(`Fatura '${createInvoiceDto.dueDate}' já existe.`);
        throw new ConflictException(
          `Invoice number '${createInvoiceDto.dueDate}' already exists`,
        );
      }

      this.logger.error(
        `Erro ao criar fatura '${createInvoiceDto.dueDate}': '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to create invoice');
    }
  }

  async findAll(): Promise<ResponseInvoiceDto[]> {
    try {
      this.logger.debug(`Buscando faturas.`);

      const invoices = await this.repository.find();

      this.logger.debug(`${invoices.length} faturas encontrados.`);

      return invoices.map((invoice) => ResponseInvoiceDto.fromEntity(invoice));
    } catch (error) {
      this.logger.error(`Erro ao buscar lista de faturas: '${error.message}'.`);
      throw new InternalServerErrorException('Error to find all invoices');
    }
  }

  async findOne(id: string): Promise<ResponseInvoiceDto> {
    try {
      this.logger.debug(`Buscando fatura pelo id '${id}'.`);

      const invoice = await this.repository.findOneBy({ id });

      if (!invoice) {
        this.logger.warn(`Nenhuma fatura encontrado pelo id '${id}'.`);
        throw new NotFoundException('Invoice not found');
      }

      this.logger.debug(
        `Fatura '${invoice.dueDate}' encontrada pelo id '${id}'.`,
      );

      return ResponseInvoiceDto.fromEntity(invoice);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Erro ao buscar fatura pelo id '${id}': '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to find one invoice');
    }
  }

  async update(
    id: string,
    updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<ResponseInvoiceDto> {
    try {
      this.logger.debug(`Atualizando fatura pelo id '${id}'.`);

      let invoice = await this.repository.findOneBy({ id });

      if (!invoice) {
        this.logger.warn(`Nenhuma fatura encontrada pelo id '${id}'.`);
        throw new NotFoundException('Invoice not found');
      }

      invoice = new InvoiceEntity({ ...invoice, ...updateInvoiceDto });
      invoice = await this.repository.save(invoice);

      this.logger.info(`Fatura '${invoice.id}' atualizado.`);

      return ResponseInvoiceDto.fromEntity(invoice);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Erro ao atualizar fatura pelo id '${id}': '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to update invoice');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.logger.debug(`Deletando fatura pelo id '${id}'.`);

      const invoice = await this.repository.findOneBy({ id });

      if (!invoice) {
        this.logger.warn(`Nenhuma fatura encontrada pelo id '${id}'.`);
        throw new NotFoundException('Invoice not found');
      }

      await this.repository.softDelete(id);

      this.logger.info(`Fatura '${invoice.dueDate}' deletada.`);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Erro ao deletar fatura pelo id '${id}': '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to remove invoice');
    }
  }
}
