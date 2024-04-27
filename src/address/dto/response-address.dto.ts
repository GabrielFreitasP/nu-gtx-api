import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsPostalCode, IsUUID } from 'class-validator';

import ApiSchema from '../../commons/decorators/api-schema.decorator';
import { AddressEntity } from '../entities/address.entity';

@ApiSchema({ name: 'Address' })
export class ResponseAddressDto {
  constructor(partial: Partial<ResponseAddressDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: 'Identificador do endereço', example: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Rua', example: 'Av. Paulista' })
  @IsNotEmpty()
  @IsString()
  street: string;

  @ApiProperty({ description: 'Número', example: '1000' })
  @IsNotEmpty()
  @IsString()
  number: string;

  @ApiProperty({ description: 'Cidade', example: 'São Paulo' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ description: 'Estado', example: 'SP' })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({ description: 'Código Postal', example: '01311-200' })
  @IsNotEmpty()
  @IsPostalCode()
  postalCode: string;

  static fromEntity({
    id,
    street,
    number,
    city,
    state,
    postalCode,
  }: AddressEntity): ResponseAddressDto {
    return new ResponseAddressDto({
      id,
      street,
      number,
      city,
      state,
      postalCode,
    });
  }
}
