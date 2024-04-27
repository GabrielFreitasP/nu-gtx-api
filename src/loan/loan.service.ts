import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LoggerService } from '../commons/logger/logger.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { ResponseLoanDto } from './dto/response-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { LoanEntity } from './entities/loan.entity';

@Injectable()
export class LoanService {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(LoanEntity)
    private readonly repository: Repository<LoanEntity>,
  ) {}

  async create(createLoanDto: CreateLoanDto): Promise<ResponseLoanDto> {
    try {
      this.logger.debug(
        `Criando empréstimo '${createLoanDto.amount} | ${createLoanDto.amount}'.`,
      );

      let loan = new LoanEntity(createLoanDto);
      loan = await this.repository.save(loan);

      this.logger.info(`Empréstimo '${loan.amount}' criado.`);

      return ResponseLoanDto.fromEntity(loan);
    } catch (error) {
      if (error.code === '23505') {
        this.logger.warn(`Empréstimo '${createLoanDto.amount}' já existe.`);
        throw new ConflictException(
          `Loan '${createLoanDto.amount}' already exists`,
        );
      }

      this.logger.error(
        `Erro ao criar empréstimo '${createLoanDto.amount}': '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to create loan');
    }
  }

  async findAll(): Promise<ResponseLoanDto[]> {
    try {
      this.logger.debug(`Buscando empréstimos.`);

      const loans = await this.repository.find();

      this.logger.debug(`${loans.length} empréstimos encontrados.`);

      return loans.map((loan) => ResponseLoanDto.fromEntity(loan));
    } catch (error) {
      this.logger.error(
        `Erro ao buscar lista de empréstimos: '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to find all loans');
    }
  }

  async findOne(id: string): Promise<ResponseLoanDto> {
    try {
      this.logger.debug(`Buscando empréstimo pelo id '${id}'.`);

      const loan = await this.repository.findOneBy({ id });

      if (!loan) {
        this.logger.warn(`Nenhum empréstimo encontrado pelo id '${id}'.`);
        throw new NotFoundException('Loan not found');
      }

      this.logger.debug(
        `Empréstimo '${loan.amount}' encontrado pelo id '${id}'.`,
      );

      return ResponseLoanDto.fromEntity(loan);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Erro ao buscar empréstimo pelo id '${id}': '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to find one loan');
    }
  }

  async update(
    id: string,
    updateLoanDto: UpdateLoanDto,
  ): Promise<ResponseLoanDto> {
    try {
      this.logger.debug(`Atualizando empréstimo pelo id '${id}'.`);

      let loan = await this.repository.findOneBy({ id });

      if (!loan) {
        this.logger.warn(`Nenhum empréstimo encontrado pelo id '${id}'.`);
        throw new NotFoundException('Loan not found');
      }

      loan = new LoanEntity({ ...loan, ...updateLoanDto });
      loan = await this.repository.save(loan);

      this.logger.info(`Empréstimo '${loan.id}' atualizado.`);

      return ResponseLoanDto.fromEntity(loan);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Erro ao atualizar empréstimo pelo id '${id}': '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to update loan');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.logger.debug(`Deletando empréstimo pelo id '${id}'.`);

      const loan = await this.repository.findOneBy({ id });

      if (!loan) {
        this.logger.warn(`Nenhum empréstimo encontrado pelo id '${id}'.`);
        throw new NotFoundException('Loan not found');
      }

      await this.repository.softDelete(id);

      this.logger.info(`Empréstimo '${loan.amount}' deletado.`);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Erro ao deletar empréstimo pelo id '${id}': '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to remove loan');
    }
  }
}
