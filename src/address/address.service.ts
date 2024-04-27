import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LoggerService } from '../commons/logger/logger.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { ResponseAddressDto } from './dto/response-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressEntity } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(AddressEntity)
    private readonly repository: Repository<AddressEntity>,
  ) {}

  async create(
    createAddressDto: CreateAddressDto,
  ): Promise<ResponseAddressDto> {
    try {
      this.logger.debug(
        `Criando endereço '${createAddressDto.postalCode} | ${createAddressDto.number}'.`,
      );

      let address = new AddressEntity(createAddressDto);
      address = await this.repository.save(address);

      this.logger.info(
        `Endereço '${address.postalCode} | ${address.number}' criado.`,
      );

      return ResponseAddressDto.fromEntity(address);
    } catch (error) {
      if (error.code === '23505') {
        this.logger.warn(
          `Endereço '${createAddressDto.postalCode} | ${createAddressDto.number}' já existe.`,
        );
        throw new ConflictException(
          `Address '${createAddressDto.postalCode} | ${createAddressDto.number}' already exists`,
        );
      }

      this.logger.error(
        `Erro ao criar endereço '${createAddressDto.postalCode} | ${createAddressDto.number}': '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to create address');
    }
  }

  async findAll(): Promise<ResponseAddressDto[]> {
    try {
      this.logger.debug(`Buscando endereços.`);

      const addresses = await this.repository.find();

      this.logger.debug(`${addresses.length} endereços encontrados.`);

      return addresses.map((address) => ResponseAddressDto.fromEntity(address));
    } catch (error) {
      this.logger.error(
        `Erro ao buscar lista de endereços: '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to find all addresses');
    }
  }

  async findOne(id: string): Promise<ResponseAddressDto> {
    try {
      this.logger.debug(`Buscando endereço pelo id '${id}'.`);

      const address = await this.repository.findOneBy({ id });

      if (!address) {
        this.logger.warn(`Nenhum endereço encontrado pelo id '${id}'.`);
        throw new NotFoundException('Address not found');
      }

      this.logger.debug(
        `Endereço '${address.postalCode} | ${address.number}' encontrado pelo id '${id}'.`,
      );

      return ResponseAddressDto.fromEntity(address);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Erro ao buscar endereço pelo id '${id}': '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to find one address');
    }
  }

  async update(
    id: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<ResponseAddressDto> {
    try {
      this.logger.debug(`Atualizando endereço pelo id '${id}'.`);

      let address = await this.repository.findOneBy({ id });

      if (!address) {
        this.logger.warn(`Nenhum endereço encontrado pelo id '${id}'.`);
        throw new NotFoundException('Address not found');
      }

      address = new AddressEntity({ ...address, ...updateAddressDto });
      address = await this.repository.save(address);

      this.logger.info(`Endereço '${address.id}' atualizado.`);

      return ResponseAddressDto.fromEntity(address);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Erro ao atualizar endereço pelo id '${id}': '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to update address');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.logger.debug(`Deletando endereço pelo id '${id}'.`);

      const address = await this.repository.findOneBy({ id });

      if (!address) {
        this.logger.warn(`Nenhum endereço encontrado pelo id '${id}'.`);
        throw new NotFoundException('Address not found');
      }

      await this.repository.softDelete(id);

      this.logger.info(
        `Endereço '${address.postalCode} | ${address.number}' deletado.`,
      );
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Erro ao deletar endereço pelo id '${id}': '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to remove address');
    }
  }
}
