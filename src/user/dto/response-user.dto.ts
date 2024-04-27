import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

import { AuthRolesEnum } from '../../auth/enums/auth-roles.enum';
import ApiSchema from '../../commons/decorators/api-schema.decorator';
import { IsEnumCombination } from '../../commons/decorators/is-enum-combination.decorator';
import { UserEntity } from '../entities/user.entity';

@ApiSchema({ name: 'User' })
export class ResponseUserDto {
  constructor(partial: Partial<ResponseUserDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: 'Identificador do usuário', example: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  id: string;

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

  @ApiProperty({ description: 'Senha do usuário', example: '$2b$10$TE2l9Ym2N' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Regras de permissão do usuário',
    example: AuthRolesEnum.ADMIN,
  })
  @IsNotEmpty()
  @IsEnumCombination(AuthRolesEnum)
  roles: string;

  @ApiProperty({ description: 'Usuário ativo', example: true })
  @IsNotEmpty()
  @IsBoolean()
  active: boolean;

  static fromEntity({
    id,
    name,
    email,
    password,
    roles,
    active,
  }: UserEntity): ResponseUserDto {
    return new ResponseUserDto({
      id,
      name,
      email,
      password,
      roles,
      active,
    });
  }
}
