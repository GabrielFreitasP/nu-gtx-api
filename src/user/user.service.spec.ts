import { faker } from '@faker-js/faker';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { AuthRolesEnum } from '../auth/enums/auth-roles.enum';
import { ConfigurationService } from '../commons/config/configuration.service';
import { LoggerService } from '../commons/logger/logger.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<UserEntity>;

  const createFakeUser = (): UserEntity =>
    new UserEntity({
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      active: faker.datatype.boolean(),
      roles: AuthRolesEnum.ADMIN,
      createdAt: faker.date.anytime(),
      updatedAt: faker.date.anytime(),
      deletedAt: null,
    });

  const createFakeCreateUserDto = (): CreateUserDto => ({
    name: faker.person.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    roles: AuthRolesEnum.ADMIN,
  });

  const createFakeUpdateUserDto = (): UpdateUserDto => ({
    name: faker.person.firstName(),
    roles: AuthRolesEnum.ADMIN,
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        LoggerService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
        {
          provide: ConfigurationService,
          useValue: {
            loggerLevel: 'silent',
            loggerLabel: 'testing',
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = createFakeCreateUserDto();

      const user = new UserEntity(createUserDto);
      jest.spyOn(repository, 'save').mockResolvedValue(user);

      const result = await service.create(createUserDto);
      expect(result).toEqual(ResponseUserDto.fromEntity(user));
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto = createFakeCreateUserDto();

      jest.spyOn(repository, 'save').mockRejectedValue({ code: '23505' });

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      const createUserDto = createFakeCreateUserDto();

      jest.spyOn(repository, 'save').mockRejectedValue(new Error());

      await expect(service.create(createUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should find all users', async () => {
      const users = [createFakeUser(), createFakeUser()];
      jest.spyOn(repository, 'find').mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(
        users.map((user) => ResponseUserDto.fromEntity(user)),
      );
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest.spyOn(repository, 'find').mockRejectedValue(new Error());

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should find one user by id', async () => {
      const id = faker.string.uuid();
      const user = createFakeUser();
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);

      const result = await service.findOne(id);
      expect(result).toEqual(ResponseUserDto.fromEntity(user));
    });

    it('should throw NotFoundException if user not found', async () => {
      const id = faker.string.uuid();
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      const id = faker.string.uuid();
      jest.spyOn(repository, 'findOneBy').mockRejectedValue(new Error());

      await expect(service.findOne(id)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const id = faker.string.uuid();
      const updateUserDto = createFakeUpdateUserDto();

      const existingUser = new UserEntity(updateUserDto);
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(existingUser);
      jest.spyOn(repository, 'save').mockResolvedValue(existingUser);

      const result = await service.update(id, updateUserDto);
      expect(result).toEqual(ResponseUserDto.fromEntity(existingUser));
    });

    it('should throw NotFoundException if user not found', async () => {
      const id = faker.string.uuid();
      const updateUserDto = createFakeUpdateUserDto();
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.update(id, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      const id = faker.string.uuid();
      const updateUserDto = createFakeUpdateUserDto();
      jest.spyOn(repository, 'findOneBy').mockRejectedValue(new Error());

      await expect(service.update(id, updateUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const id = faker.string.uuid();
      const existingUser = createFakeUser();
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(existingUser);
      jest
        .spyOn(repository, 'softDelete')
        .mockResolvedValue({} as UpdateResult);

      await service.remove(id);
      expect(repository.softDelete).toHaveBeenCalledWith({ id });
    });

    it('should throw NotFoundException if user not found', async () => {
      const id = faker.string.uuid();
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      const id = faker.string.uuid();
      jest.spyOn(repository, 'findOneBy').mockRejectedValue(new Error());

      await expect(service.remove(id)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
