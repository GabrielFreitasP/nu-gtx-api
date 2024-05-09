import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LoggerService } from '../commons/logger/logger.service';
import { UserEntity } from '../user/entities/user.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { ResponseAccountDto } from './dto/response-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountEntity } from './entities/account.entity';

@Injectable()
export class AccountService {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(AccountEntity)
    private readonly repository: Repository<AccountEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(
    createAccountDto: CreateAccountDto,
  ): Promise<ResponseAccountDto> {
    try {
      this.logger.debug(`Criando conta '${createAccountDto.number}'.`);

      const { userId } = createAccountDto;
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      let account = new AccountEntity({ ...createAccountDto, user });
      account = await this.repository.save(account);

      this.logger.info(`Conta '${account.number}' criada.`);

      return ResponseAccountDto.fromEntity(account);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      if (error.code === '23505') {
        this.logger.warn(`Conta '${createAccountDto.number}' já existe.`);
        throw new ConflictException(
          `Account number '${createAccountDto.number}' already exists`,
        );
      }

      this.logger.error(
        `Erro ao criar conta '${createAccountDto.number}': '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to create account');
    }
  }

  async findAll(): Promise<ResponseAccountDto[]> {
    try {
      this.logger.debug(`Buscando contas.`);

      const accounts = await this.repository.find();

      this.logger.debug(`${accounts.length} contas encontrados.`);

      return accounts.map((account) => ResponseAccountDto.fromEntity(account));
    } catch (error) {
      this.logger.error(`Erro ao buscar lista de contas: '${error.message}'.`);
      throw new InternalServerErrorException('Error to find all accounts');
    }
  }

  async findOne(id: string): Promise<ResponseAccountDto> {
    try {
      this.logger.debug(`Buscando conta pelo id '${id}'.`);

      const account = await this.repository.findOneBy({ id });

      if (!account) {
        this.logger.warn(`Nenhuma conta encontrado pelo id '${id}'.`);
        throw new NotFoundException('Account not found');
      }

      this.logger.debug(
        `Conta '${account.number}' encontrada pelo id '${id}'.`,
      );

      return ResponseAccountDto.fromEntity(account);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Erro ao buscar conta pelo id '${id}': '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to find one account');
    }
  }

  async update(
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<ResponseAccountDto> {
    try {
      this.logger.debug(`Atualizando conta pelo id '${id}'.`);

      let account = await this.repository.findOneBy({ id });

      if (!account) {
        this.logger.warn(`Nenhuma conta encontrada pelo id '${id}'.`);
        throw new NotFoundException('Account not found');
      }

      account = new AccountEntity({ ...account, ...updateAccountDto });
      account = await this.repository.save(account);

      this.logger.info(`Conta '${account.id}' atualizado.`);

      return ResponseAccountDto.fromEntity(account);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Erro ao atualizar conta pelo id '${id}': '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to update account');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.logger.debug(`Deletando conta pelo id '${id}'.`);

      const account = await this.repository.findOneBy({ id });

      if (!account) {
        this.logger.warn(`Nenhuma conta encontrada pelo id '${id}'.`);
        throw new NotFoundException('Account not found');
      }

      await this.repository.softDelete(id);

      this.logger.info(`Conta '${account.number}' deletada.`);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Erro ao deletar conta pelo id '${id}': '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to remove account');
    }
  }
}
