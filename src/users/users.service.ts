import { BadRequestException, HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateShpAddressDto, CreateUserDto, UpdateProfileDto, UpdateShpAddressDto, CreateLogin_infoDto, CreateBillAddressDto, UpdateBillAddressDto } from './dto';
import { HashUtils } from 'src/utils';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

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
      throw new RpcException({
        message: `Invalid credentials`,
        statusCode: HttpStatus.BAD_REQUEST
      });
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
      throw new RpcException({
        message: `Invalid credentials`,
        statusCode: HttpStatus.BAD_REQUEST
      });
    }

    const isPasswordMatch = await HashUtils.comparePassword(password, user.password.password);

    if (!isPasswordMatch) {
      throw new RpcException({
        message: `Invalid credentials`,
        statusCode: HttpStatus.BAD_REQUEST
      });
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

  async findAll(paginationDto: PaginationDto) {

    const { page, limit } = paginationDto;

    const totalUsers = await this.login_info.count();
    const lastPage = Math.ceil(totalUsers / limit);

    if (page > lastPage) {
      throw new RpcException({
        message: `Page ${page} not found`,
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    return {
      data: await this.login_info.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          activity: true,
          profile: true
        }
      }),
      meta: {
        totalUsers,
        page,
        lastPage
      }
    }

  }

  async findOneById(id: string) {

    const findResult = await this.login_info.findUnique({
      where: {
        id: id
      },
      include: {
        activity: true,
        profile: true,
        shipping_address: true,
        billing_address: true
      }
    })

    if (!findResult) {
      throw new RpcException({
        message: `User not found`,
        statusCode: HttpStatus.NOT_FOUND
      })
    }

    return findResult;
  }

  async findProfile(id: string) {

    const findResult = await this.profile.findUnique({
      where: {
        login_info_id: id
      }
    })

    if (!findResult) {
      throw new RpcException({
        message: `User not found`,
        statusCode: HttpStatus.NOT_FOUND
      })
    }

    return findResult;

  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {

    if (!Object.keys(updateProfileDto).length) {
      throw new RpcException({
        message: `No data to update`,
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    const user = await this.findOneById(id);

    const isDifferent = Object.keys(updateProfileDto).some(key => user.profile[key] !== updateProfileDto[key]);

    if (!isDifferent) {
      throw new RpcException({
        message: `No data to update`,
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    return await this.profile.update({
      where: {
        login_info_id: id
      },
      data: updateProfileDto
    })
  }

  async createShpAddress(id: string, createShpAddressDto: CreateShpAddressDto) {

    const limitAddress = await this.shipping_address.count({
      where: {
        login_info_id: id
      }
    })

    if (limitAddress >= 3) {
      throw new RpcException({
        message: `Limit of 3 shipping address, reached`,
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    return await this.shipping_address.create({
      data: {
        ...createShpAddressDto,
        login_info_id: id
      }
    })

  }

  async findShpAddress(shp_id: string) {

    const findResult = await this.shipping_address.findUnique({
      where: {
        id: shp_id
      }
    })

    if (!findResult) {
      throw new RpcException({
        message: `Shipping address not found`,
        statusCode: HttpStatus.NOT_FOUND
      })
    }

    return findResult;

  }

  async updateShpAddress(shp_id: string, updateShpAddressDto: UpdateShpAddressDto) {

    if (!Object.keys(updateShpAddressDto).length) {
      throw new RpcException({
        message: `No data to update`,
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    return await this.shipping_address.update({
      where: {
        id: shp_id
      },
      data: updateShpAddressDto
    })

  }

  async createBillAddress(user_id: string, createBillAddressDto: CreateBillAddressDto) {

    const findResult = await this.billing_address.findUnique({
      where: {
        login_info_id: user_id
      }
    })

    if (findResult) {
      throw new RpcException({
        message: `Billing address already exists`,
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    const createResult = await this.billing_address.create({
      data: {
        ...createBillAddressDto,
        login_info_id: user_id
      }
    })

    return createResult;

  }

  async findBillAddress(user_id: string) {

    const findResult = await this.billing_address.findUnique({
      where: {
        login_info_id: user_id
      }
    })

    if (!findResult) {
      throw new RpcException({
        message: `Billing address not found`,
        statusCode: HttpStatus.NOT_FOUND
      })
    }

    return findResult;

  }

  async updateBillAddress(id: string, updateBillAddressDto: UpdateBillAddressDto) {

    if (!Object.keys(updateBillAddressDto).length) {
      throw new RpcException({
        message: `No data to update`,
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    return await this.billing_address.update({
      where: {
        login_info_id: id
      },
      data: updateBillAddressDto
    })

  }

}
