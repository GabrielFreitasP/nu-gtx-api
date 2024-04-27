import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthRolesEnum } from '../auth/enums/auth-roles.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

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

  const createFakeResponseUserDto = (): ResponseUserDto => ({
    id: faker.string.uuid(),
    name: faker.person.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    roles: AuthRolesEnum.ADMIN,
    active: true,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = createFakeCreateUserDto();
      const responseUserDto = createFakeResponseUserDto();
      jest.spyOn(userService, 'create').mockResolvedValue(responseUserDto);

      expect(await controller.create(createUserDto)).toBe(responseUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const responseUserDto = [
        createFakeResponseUserDto(),
        createFakeResponseUserDto(),
      ];
      jest.spyOn(userService, 'findAll').mockResolvedValue(responseUserDto);

      expect(await controller.findAll()).toBe(responseUserDto);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const responseUserDto = createFakeResponseUserDto();
      jest.spyOn(userService, 'findOne').mockResolvedValue(responseUserDto);

      expect(await controller.findOne(responseUserDto.id)).toBe(
        responseUserDto,
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      jest
        .spyOn(userService, 'findOne')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(faker.string.uuid())).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto = createFakeUpdateUserDto();
      const responseUserDto = createFakeResponseUserDto();
      jest.spyOn(userService, 'update').mockResolvedValue(responseUserDto);

      expect(await controller.update(responseUserDto.id, updateUserDto)).toBe(
        responseUserDto,
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      jest
        .spyOn(userService, 'update')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.update(faker.string.uuid(), createFakeUpdateUserDto()),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(userService, 'remove').mockResolvedValue(undefined);

      expect(await controller.remove(faker.string.uuid())).toBeUndefined();
    });

    it('should throw NotFoundException if user not found', async () => {
      jest
        .spyOn(userService, 'remove')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.remove(faker.string.uuid())).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
