import { faker } from '@faker-js/faker';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { ConfigurationService } from '../commons/config/configuration.service';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;

  let findOneByEmailMock: jest.Mock;
  let signMock: jest.Mock;

  let authJwtExpiresInMock: number;
  let userMock: UserEntity;
  let accessTokenMock: string;

  beforeEach(async () => {
    jest.clearAllMocks();

    findOneByEmailMock = jest.fn();
    signMock = jest.fn();

    authJwtExpiresInMock = 3600;
    userMock = new UserEntity({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      active: faker.datatype.boolean(),
      roles: 'admin,user',
    });
    accessTokenMock = 'accessToken';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOneByEmail: findOneByEmailMock,
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: signMock,
          },
        },
        {
          provide: ConfigurationService,
          useValue: {
            authJwtExpiresIn: authJwtExpiresInMock,
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate user successfully and return user', async () => {
      findOneByEmailMock.mockResolvedValueOnce(userMock);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValueOnce(true);

      const result = await authService.validateUser(
        userMock.email,
        userMock.password,
      );
      expect(result).toEqual(userMock);

      expect(findOneByEmailMock).toHaveBeenCalledTimes(1);
      expect(findOneByEmailMock).toHaveBeenCalledWith(userMock.email);

      expect(bcrypt.compareSync).toHaveBeenCalledTimes(1);
      expect(bcrypt.compareSync).toHaveBeenCalledWith(
        userMock.password,
        userMock.password,
      );
    });

    it('should throw UnauthorizedException for invalid username or password', async () => {
      findOneByEmailMock.mockRejectedValueOnce(new NotFoundException());

      const promise = authService.validateUser(
        userMock.email,
        userMock.password,
      );
      await expect(promise).rejects.toThrow(UnauthorizedException);

      expect(findOneByEmailMock).toHaveBeenCalledTimes(1);
      expect(findOneByEmailMock).toHaveBeenCalledWith(userMock.email);

      expect(bcrypt.compareSync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      findOneByEmailMock.mockResolvedValueOnce(userMock);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValueOnce(false);

      const promise = authService.validateUser(
        userMock.email,
        userMock.password,
      );
      await expect(promise).rejects.toThrow(UnauthorizedException);

      expect(findOneByEmailMock).toHaveBeenCalledTimes(1);
      expect(findOneByEmailMock).toHaveBeenCalledWith(userMock.email);

      expect(bcrypt.compareSync).toHaveBeenCalledTimes(1);
      expect(bcrypt.compareSync).toHaveBeenCalledWith(
        userMock.password,
        userMock.password,
      );
    });
  });

  describe('login', () => {
    it('should generate access token and return user information', async () => {
      signMock.mockReturnValueOnce(accessTokenMock);

      const result = await authService.login(userMock);
      expect(result).toEqual({
        email: userMock.email,
        accessToken: accessTokenMock,
        expiresIn: `${authJwtExpiresInMock}s`,
      });

      expect(signMock).toHaveBeenCalledTimes(1);
      expect(signMock).toHaveBeenCalledWith({
        email: userMock.email,
        roles: userMock.roles,
      });
    });

    it('should throw exception when sing fails', async () => {
      const jwtErrorMock = new Error('JWT error');
      signMock.mockImplementation(() => {
        throw jwtErrorMock;
      });

      const promise = authService.login(userMock);
      await expect(promise).rejects.toThrow(jwtErrorMock);

      expect(signMock).toHaveBeenCalledTimes(1);
      expect(signMock).toHaveBeenCalledWith({
        email: userMock.email,
        roles: userMock.roles,
      });
    });
  });
});
