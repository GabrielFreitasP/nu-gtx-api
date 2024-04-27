import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsBoolean,
  IsUUID,
  IsCurrency,
} from 'class-validator';

import ApiSchema from '../../commons/decorators/api-schema.decorator';

@ApiSchema({ name: 'CreateCard' })
export class CreateCardDto {
  @ApiProperty({ description: 'ID da conta associada', example: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  accountId: string;

  @ApiProperty({
    description: 'Número do cartão',
    example: '1234-5678-9012-3456',
  })
  @IsNotEmpty()
  @IsString()
  number: string;

  @ApiProperty({ description: 'Data de validade', example: '2025-12-01' })
  @IsNotEmpty()
  @IsDate()
  expirationDate: Date;

  @ApiProperty({ description: 'CVV', example: '123' })
  @IsNotEmpty()
  @IsString()
  cvv: string;

  @ApiProperty({ description: 'Limite do cartão', example: 15000.0 })
  @IsNotEmpty()
  @IsCurrency()
  limit: number;

  @ApiProperty({ description: 'Status de ativação do cartão', example: true })
  @IsNotEmpty()
  @IsBoolean()
  active: boolean;
}
