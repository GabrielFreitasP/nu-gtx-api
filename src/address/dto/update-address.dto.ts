import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsPostalCode } from 'class-validator';

import ApiSchema from '../../commons/decorators/api-schema.decorator';

@ApiSchema({ name: 'UpdateAddress' })
export class UpdateAddressDto {
  @ApiProperty({
    description: 'Rua',
    example: 'Av. Nova',
    required: false,
  })
  @IsString()
  street?: string;

  @ApiProperty({
    description: 'Número',
    example: '2000',
    required: false,
  })
  @IsString()
  number?: string;

  @ApiProperty({
    description: 'Cidade',
    example: 'Rio de Janeiro',
    required: false,
  })
  @IsString()
  city?: string;

  @ApiProperty({
    description: 'Estado',
    example: 'RJ',
    required: false,
  })
  @IsString()
  state?: string;

  @ApiProperty({
    description: 'Código Postal',
    example: '20000-000',
    required: false,
  })
  @IsPostalCode()
  postalCode?: string;
}
