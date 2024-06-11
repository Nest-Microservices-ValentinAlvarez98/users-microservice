import { BadRequestException, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateShpAddressDto, CreateUserDto, UpdateProfileDto, UpdateShpAddressDto, CreateLogin_infoDto } from './dto';
import { HashUtils } from 'src/utils';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(UsersService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to the database');
  }

  async create(createUserDto: CreateUserDto) {

    const { email, password, ...profile } = createUserDto;

    const existingUser = await this.login_info.findUnique({
      where: {
        email: email
      }
    })

    if (existingUser) {
      throw new BadRequestException(`Invalid credentials`);
    }

    const hashedPassword = await HashUtils.hashPassword(password);

    const transactionResult = await this.$transaction(async (prisma) => {

      const logingInfo = await prisma.login_info.create({
        data: {
          email: email
        }
      })

      await prisma.password.create({
        data: {
          password: hashedPassword,
          login_info_id: logingInfo.id
        }
      })

      await prisma.activity.create({
        data: {
          login_info_id: logingInfo.id,
        }
      })

      await prisma.profile.create({
        data: {
          ...profile,
          display_name: logingInfo.email,
          login_info_id: logingInfo.id
        }
      })

      const foundResults = await prisma.login_info.findUnique({
        where: {
          id: logingInfo.id
        },
        include: {
          password: true,
          activity: true,
          profile: true
        }
      })

      return foundResults;

    })

    return transactionResult;
  }

  async login(createLogin_infoDto: CreateLogin_infoDto) {

    const { email, password } = createLogin_infoDto;

    const user = await this.login_info.findUnique({
      where: {
        email: email,
        is_available: true
      },
      include: {
        password: true,
        profile: true
      }
    })

    if (!user) {
      throw new BadRequestException(`Invalid credentials`);
    }

    const isPasswordMatch = await HashUtils.comparePassword(password, user.password.password);

    if (!isPasswordMatch) {
      throw new BadRequestException(`Invalid credentials`);
    }

    const payload = Object.assign({
      user: {
        id: user.id,
        email: user.email,
        profile: user.profile
      },
      login: true
    })

    return payload

  }

  async createShpAddress(id: string, createShpAddressDto: CreateShpAddressDto) {

    const limitAddress = await this.shipping_address.count({
      where: {
        login_info_id: id
      }
    })

    if (limitAddress >= 3) {
      throw new BadRequestException(`Limit of addresses reached`);
    }

    return await this.shipping_address.create({
      data: {
        ...createShpAddressDto,
        login_info_id: id
      }
    })

  }

  async findAll() {
    return await this.login_info.findMany({
      include: {
        activity: true,
        profile: true
      }
    })
  }

  async findOneById(id: string) {

    const findResult = await this.login_info.findUnique({
      where: {
        id: id
      },
      include: {
        activity: true,
        profile: true,
        shipping_address: true
      }
    })

    if (!findResult) {
      throw new BadRequestException('User not found');
    }

    return findResult;
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {

    if (!Object.keys(updateProfileDto).length) {
      throw new BadRequestException('No data to update');
    }

    const user = await this.findOneById(id);

    const isDifferent = Object.keys(updateProfileDto).some(key => user.profile[key] !== updateProfileDto[key]);
    if (!isDifferent) {
      throw new BadRequestException(`Nothing to update`);
    }

    return await this.profile.update({
      where: {
        login_info_id: id
      },
      data: updateProfileDto
    })
  }

  async updateShpAddress(id: string, updateShpAddressDto: UpdateShpAddressDto) {

    if (!Object.keys(updateShpAddressDto).length) {
      throw new BadRequestException('No data to update');
    }

    return await this.shipping_address.update({
      where: {
        id: id
      },
      data: updateShpAddressDto
    })

  }

}
