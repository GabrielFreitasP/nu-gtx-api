import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsCurrency } from 'class-validator';

import ApiSchema from '../../commons/decorators/api-schema.decorator';

@ApiSchema({ name: 'UpdateCard' })
export class UpdateCardDto {
  @ApiProperty({
    description: 'Limite do cartão',
    example: 16000.0,
    required: false,
  })
  @IsCurrency()
  limit?: number;

  @ApiProperty({
    description: 'Status de ativação do cartão',
    example: true,
    required: false,
  })
  @IsBoolean()
  active?: boolean;
}
