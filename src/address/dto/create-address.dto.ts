import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsPostalCode } from 'class-validator';

import ApiSchema from '../../commons/decorators/api-schema.decorator';

@ApiSchema({ name: 'CreateAddress' })
export class CreateAddressDto {
  @ApiProperty({ description: 'Rua', example: 'Av. Paulista' })
  @IsNotEmpty()
  @IsString()
  street: string;

  @ApiProperty({ description: 'Número', example: '1000' })
  @IsNotEmpty()
  @IsString()
  number: string;

  @ApiProperty({ description: 'Cidade', example: 'São Paulo' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ description: 'Estado', example: 'SP' })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({ description: 'Código Postal', example: '01311-200' })
  @IsNotEmpty()
  @IsPostalCode('BR')
  postalCode: string;
}
