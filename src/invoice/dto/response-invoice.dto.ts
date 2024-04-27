import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsBoolean,
  IsDate,
  IsCurrency,
} from 'class-validator';

import ApiSchema from '../../commons/decorators/api-schema.decorator';
import { InvoiceEntity } from '../entities/invoice.entity';

@ApiSchema({ name: 'Invoice' })
export class ResponseInvoiceDto {
  constructor(partial: Partial<ResponseInvoiceDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: 'Identificador da fatura', example: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Data de fechamento da fatura',
    example: '2024-12-05',
  })
  @IsNotEmpty()
  @IsDate()
  closingDate: Date;

  @ApiProperty({
    description: 'Data de vencimento da fatura',
    example: '2024-12-20',
  })
  @IsNotEmpty()
  @IsDate()
  dueDate: Date;

  @ApiProperty({ description: 'Valor total da fatura', example: 2000.0 })
  @IsNotEmpty()
  @IsCurrency()
  totalAmount: number;

  @ApiProperty({ description: 'Status de pagamento', example: false })
  @IsNotEmpty()
  @IsBoolean()
  paid: boolean;

  static fromEntity({
    id,
    closingDate,
    dueDate,
    totalAmount,
    paid,
  }: InvoiceEntity): ResponseInvoiceDto {
    return new ResponseInvoiceDto({
      id,
      closingDate,
      dueDate,
      totalAmount,
      paid,
    });
  }
}
