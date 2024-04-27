import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsBoolean,
  IsCurrency,
} from 'class-validator';

import ApiSchema from '../../commons/decorators/api-schema.decorator';
import { CardEntity } from '../entities/card.entity';

@ApiSchema({ name: 'Card' })
export class ResponseCardDto {
  constructor(partial: Partial<ResponseCardDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: 'Identificador do cartão', example: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Número do cartão',
    example: '1234-5678-9012-3456',
  })
  @IsNotEmpty()
  @IsString()
  number: string;

  @ApiProperty({ description: 'Limite do cartão', example: 15000.0 })
  @IsNotEmpty()
  @IsCurrency()
  limit: number;

  @ApiProperty({ description: 'Status de ativação do cartão', example: true })
  @IsNotEmpty()
  @IsBoolean()
  active: boolean;

  static fromEntity({
    id,
    number: cardNumber,
    limit,
    active,
  }: CardEntity): ResponseCardDto {
    return new ResponseCardDto({ id, number: cardNumber, limit, active });
  }
}
