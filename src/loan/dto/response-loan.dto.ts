import { ApiProperty } from '@nestjs/swagger';
import { IsCurrency, IsDecimal, IsNotEmpty, IsUUID } from 'class-validator';

import ApiSchema from '../../commons/decorators/api-schema.decorator';
import { LoanEntity } from '../entities/loan.entity';

@ApiSchema({ name: 'Loan' })
export class ResponseLoanDto {
  constructor(partial: Partial<ResponseLoanDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: 'Identificador do empréstimo', example: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Valor do empréstimo', example: 5000.0 })
  @IsNotEmpty()
  @IsCurrency()
  amount: number;

  @ApiProperty({ description: 'Taxa de juros', example: 5.0 })
  @IsNotEmpty()
  @IsDecimal()
  interestRate: number;

  @ApiProperty({ description: 'ID do usuário', example: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  static fromEntity({
    id,
    amount,
    interestRate,
    user,
  }: LoanEntity): ResponseLoanDto {
    return new ResponseLoanDto({ id, amount, interestRate, userId: user.id });
  }
}
