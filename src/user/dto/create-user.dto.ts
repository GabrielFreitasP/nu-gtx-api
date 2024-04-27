import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { AuthRolesEnum } from '../../auth/enums/auth-roles.enum';
import ApiSchema from '../../commons/decorators/api-schema.decorator';
import { IsEnumCombination } from '../../commons/decorators/is-enum-combination.decorator';

@ApiSchema({ name: 'CreateUser' })
export class CreateUserDto {
  @ApiProperty({ description: 'Nome do usuário', example: 'admin' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'admin@gtx.com.br',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do usuário', example: '123' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Regras de permissão do usuário',
    example: AuthRolesEnum.ADMIN,
  })
  @IsNotEmpty()
  @IsEnumCombination(AuthRolesEnum)
  roles: string;
}
