import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsCurrency } from 'class-validator';

import ApiSchema from '../../commons/decorators/api-schema.decorator';

@ApiSchema({ name: 'UpdateInvoice' })
export class UpdateInvoiceDto {
  @ApiProperty({
    description: 'Valor total da fatura',
    example: 2100.0,
    required: false,
  })
  @IsCurrency()
  totalAmount?: number;

  @ApiProperty({
    description: 'Status de pagamento',
    example: true,
    required: false,
  })
  @IsBoolean()
  paid?: boolean;
}
