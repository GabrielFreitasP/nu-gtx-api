import { ApiProperty } from '@nestjs/swagger';

import ApiSchema from '../decorators/api-schema.decorator';

@ApiSchema({ name: 'Error' })
export class ErrorResponse {
  @ApiProperty({ description: 'Mensagem do erro', example: 'Invalid params' })
  message: string;

  @ApiProperty({ description: 'Tipo do erro', example: 'Bad Request' })
  error: string;

  @ApiProperty({ description: 'Código do erro', example: 400 })
  statusCode: number;
}
