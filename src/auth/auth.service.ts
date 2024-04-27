import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { ConfigurationService } from '../commons/config/configuration.service';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { ResponseLoginDto } from './dto/response-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private configurationService: ConfigurationService,
    private jwtService: JwtService,
    private usersService: UserService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserEntity> {
    try {
      const user = await this.usersService.findOneByEmail(email);

      const result = bcrypt.compareSync(password, user.password);
      if (!result) {
        throw new UnauthorizedException('Invalid password');
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('Invalid username or password');
      }

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException('Error validing user');
    }
  }

  async login({ email, roles }: UserEntity): Promise<ResponseLoginDto> {
    return {
      email,
      accessToken: this.jwtService.sign({ email, roles }),
      expiresIn: `${this.configurationService.authJwtExpiresIn}s`,
    };
  }
}
