import { ApiProperty } from '@nestjs/swagger';
import {
  IsCurrency,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsUUID,
} from 'class-validator';

import ApiSchema from '../../commons/decorators/api-schema.decorator';

@ApiSchema({ name: 'CreateAccount' })
export class CreateAccountDto {
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
  @IsNumberString()
  digit: string;

  @ApiProperty({ description: 'Saldo inicial da conta', example: 1000.0 })
  @IsNotEmpty()
  @IsCurrency()
  balance: number;

  @ApiProperty({ description: 'Dinheiro guardado na conta', example: 2000.0 })
  @IsOptional()
  @IsCurrency()
  savedAmount: number | null;

  @ApiProperty({ description: 'Rendimentos da conta', example: 25.5 })
  @IsOptional()
  @IsCurrency()
  accountYield: number | null;

  @ApiProperty({ description: 'ID do usuário associado', example: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
