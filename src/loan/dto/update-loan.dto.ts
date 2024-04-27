import { ApiProperty } from '@nestjs/swagger';
import { IsCurrency, IsDecimal } from 'class-validator';

import ApiSchema from '../../commons/decorators/api-schema.decorator';

@ApiSchema({ name: 'UpdateLoan' })
export class UpdateLoanDto {
  @ApiProperty({
    description: 'Valor do empréstimo',
    example: 5500.0,
    required: false,
  })
  @IsCurrency()
  amount?: number;

  @ApiProperty({
    description: 'Taxa de juros',
    example: 5.5,
    required: false,
  })
  @IsDecimal()
  interestRate?: number;
}
