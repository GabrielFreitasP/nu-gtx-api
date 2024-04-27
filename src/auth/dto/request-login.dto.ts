import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import ApiSchema from '../../commons/decorators/api-schema.decorator';

@ApiSchema({ name: 'Login' })
export class RequestLoginDto {
  @ApiProperty({
    description: 'E-mail para autenticação',
    example: 'admin@gtx.com.br',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha para autenticação', example: '123' })
  @Transform(({ value }: TransformFnParams) => value.toString())
  @IsNotEmpty()
  @IsString()
  password: string;
}
