import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { AuthRolesEnum } from '../../auth/enums/auth-roles.enum';
import ApiSchema from '../../commons/decorators/api-schema.decorator';
import { IsEnumCombination } from '../../commons/decorators/is-enum-combination.decorator';

@ApiSchema({ name: 'UpdateUser' })
export class UpdateUserDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'admin',
    required: false,
  })
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: '123',
    required: false,
  })
  @IsString()
  password?: string;

  @ApiProperty({
    description: 'Regras de permissão do usuário',
    example: AuthRolesEnum.ADMIN,
    required: false,
  })
  @IsEnumCombination(AuthRolesEnum)
  roles?: string;
}
