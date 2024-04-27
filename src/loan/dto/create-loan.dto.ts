import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDecimal, IsUUID, IsCurrency } from 'class-validator';

import ApiSchema from '../../commons/decorators/api-schema.decorator';

@ApiSchema({ name: 'CreateLoan' })
export class CreateLoanDto {
  @ApiProperty({ description: 'ID do usuário', example: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Valor do empréstimo', example: 5000.0 })
  @IsNotEmpty()
  @IsCurrency()
  amount: number;

  @ApiProperty({ description: 'Taxa de juros', example: 5.0 })
  @IsNotEmpty()
  @IsDecimal()
  interestRate: number;
}
