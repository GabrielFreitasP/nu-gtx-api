import { ApiProperty } from '@nestjs/swagger';

import ApiSchema from '../../commons/decorators/api-schema.decorator';

@ApiSchema({ name: 'Auth' })
export class ResponseLoginDto {
  @ApiProperty({
    description: 'E-mail autenticado',
    example: 'admin@gtx.com.br',
  })
  email: string;

  @ApiProperty({
    description: 'Chave de acesso da API',
    example: '$2y$04$cYSc/jadfCXbodVtFKK8gOjmJER4UyY23Aw7ncstJ571yfcB.6TZC',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Tempo de expiração da chave de acesso',
    example: '3000s',
  })
  expiresIn: string;
}
