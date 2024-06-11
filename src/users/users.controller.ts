import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe, NotImplementedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateShpAddressDto, CreateBillAddressDto, CreateUserDto, UpdateProfileDto, UpdateShpAddressDto, CreateLogin_infoDto, UpdateBillAddressDto } from './dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @MessagePattern('users.register')
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern('users.login')
  login(@Payload() createLogin_infoDto: CreateLogin_infoDto) {
    return this.usersService.login(createLogin_infoDto);
  }

  @MessagePattern('users.find.all')
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @MessagePattern('users.findById')
  findOneById(@Payload('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOneById(id);
  }

  @MessagePattern('users.profile.findById')
  findProfile(@Payload('id', ParseUUIDPipe) id: string) {
    return this.usersService.findProfile(id);
  }

  @MessagePattern('users.profile.update')
  updateProfile(
    @Payload('id', ParseUUIDPipe) id: string,
    @Payload('profile') updateProfileDto: UpdateProfileDto
  ) {
    return this.usersService.updateProfile(id, updateProfileDto);
  }

  @MessagePattern('users.shipping.address.create')
  createShpAddress(
    @Payload('id', ParseUUIDPipe) id: string,
    @Payload('shp_address') createShpAddressDto: CreateShpAddressDto) {
    return this.usersService.createShpAddress(id, createShpAddressDto);
  }

  @MessagePattern('users.shipping.address.findByShpId')
  findShpAddress(@Payload('shp_id', ParseUUIDPipe) shp_id: string) {
    return this.usersService.findShpAddress(shp_id);
  }

  @MessagePattern('users.shipping.address.updateByShpId')
  updateShpAddress(
    @Payload('shp_id', ParseUUIDPipe) shp_id: string,
    @Payload('shp_address') updateShpAddressDto: UpdateShpAddressDto) {
    return this.usersService.updateShpAddress(shp_id, updateShpAddressDto);
  }

  @MessagePattern('users.billing.address.create')
  createBillAddress(
    @Payload('id', ParseUUIDPipe) id: string,
    @Payload('bill_address') createBillAddressDto: CreateBillAddressDto) {
    return this.usersService.createBillAddress(id, createBillAddressDto);
  }

  @MessagePattern('users.billing.address.findById')
  findBillAddress(@Payload('id', ParseUUIDPipe) id: string) {
    return this.usersService.findBillAddress(id);
  }

  @MessagePattern('users.billing.address.update')
  updateBillAddress(
    @Payload('id', ParseUUIDPipe) id: string,
    @Payload('bill_address') updateBillAddressDto: UpdateBillAddressDto) {

    return this.usersService.updateBillAddress(id, updateBillAddressDto);
  }

}
