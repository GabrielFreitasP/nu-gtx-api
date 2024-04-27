import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsDate,
  IsBoolean,
  IsUUID,
  IsCurrency,
} from 'class-validator';

import ApiSchema from '../../commons/decorators/api-schema.decorator';

@ApiSchema({ name: 'CreateInvoice' })
export class CreateInvoiceDto {
  @ApiProperty({ description: 'ID do cartão associado', example: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  cardId: string;

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
}
