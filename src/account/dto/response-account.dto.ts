import { ApiProperty } from '@nestjs/swagger';
import {
  IsCurrency,
  IsNotEmpty,
  IsNumberString,
  IsUUID,
} from 'class-validator';

import ApiSchema from '../../commons/decorators/api-schema.decorator';
import { AccountEntity } from '../entities/account.entity';

@ApiSchema({ name: 'Account' })
export class ResponseAccountDto {
  constructor(partial: Partial<ResponseAccountDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: 'Identificador da conta', example: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Número da agência', example: '0001' })
  @IsNotEmpty()
  @IsNumberString()
  agency: string;

  @ApiProperty({ description: 'Número da conta', example: '08765432' })
  @IsNotEmpty()
  @IsNumberString()
  number: string;

  @ApiProperty({
    description: 'Dígito verificador do número da conta',
    example: '1',
  })
  @IsNotEmpty()
  digit: string;

  @ApiProperty({ description: 'Saldo da conta', example: 1000.0 })
  @IsNotEmpty()
  @IsCurrency()
  balance: number;

  @ApiProperty({ description: 'Dinheiro guardado na conta', example: 2000.0 })
  @IsCurrency()
  savedAmount: number;

  @ApiProperty({ description: 'Rendimentos da conta', example: 25.5 })
  @IsCurrency()
  accountYield: number;

  @ApiProperty({ description: 'ID do usuário associado', example: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  static fromEntity({
    id,
    agency,
    number,
    digit,
    balance,
    savedAmount,
    accountYield,
    userId,
  }: AccountEntity): ResponseAccountDto {
    return new ResponseAccountDto({
      id,
      agency,
      number,
      digit,
      balance,
      savedAmount,
      accountYield,
      userId,
    });
  }
}
