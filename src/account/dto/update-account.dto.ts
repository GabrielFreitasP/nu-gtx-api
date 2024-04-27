import { ApiProperty } from '@nestjs/swagger';
import { IsCurrency, IsNumberString } from 'class-validator';

import ApiSchema from '../../commons/decorators/api-schema.decorator';

@ApiSchema({ name: 'UpdateAccount' })
export class UpdateAccountDto {
  @ApiProperty({
    description: 'Número da agência',
    example: '0001',
    required: false,
  })
  @IsNumberString()
  agency?: string;

  @ApiProperty({
    description: 'Número da conta',
    example: '08765432',
    required: false,
  })
  @IsNumberString()
  number?: string;

  @ApiProperty({
    description: 'Dígito verificador do número da conta',
    example: '1',
    required: false,
  })
  digit?: string;

  @ApiProperty({
    description: 'Saldo da conta',
    example: 1200.0,
    required: false,
  })
  @IsCurrency()
  balance?: number;

  @ApiProperty({
    description: 'Dinheiro guardado na conta',
    example: 2000.0,
    required: false,
  })
  @IsCurrency()
  savedAmount?: number;

  @ApiProperty({
    description: 'Rendimentos da conta',
    example: 25.5,
    required: false,
  })
  @IsCurrency()
  accountYield?: number;
}
