import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe, NotImplementedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateShpAddressDto, CreateUserDto, UpdateProfileDto, UpdateShpAddressDto, CreateLogin_infoDto } from './dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  login(@Body() createLogin_infoDto: CreateLogin_infoDto) {
    return this.usersService.login(createLogin_infoDto);
  }

  @Post('/create/shipping-address/:id')
  createShpAddress(@Param('id', ParseUUIDPipe) id: string, @Body() createShpAddressDto: CreateShpAddressDto) {
    return this.usersService.createShpAddress(id, createShpAddressDto);
  }

  @Get('users')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('id/:id')
  findOneById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOneById(id);
  }

  @Patch('/profile/:id')
  updateProfile(@Param('id', ParseUUIDPipe) id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(id, updateProfileDto);
  }

  @Patch('/update/shipping-address/:id')
  updateShpAddress(@Param('id', ParseUUIDPipe) id: string, @Body() updateShpAddressDto: UpdateShpAddressDto) {
    return this.usersService.updateShpAddress(id, updateShpAddressDto);
  }

}
