import { CreateUserDto } from './../users/dto/create-user.dto';
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RolesDecorator } from './roles.decorator';
import Roles from 'src/types/roles';
import { RolesGuard } from './roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/registration')
  register(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }

  @Post('/login')
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }

  @RolesDecorator(Roles.Admin)
  @UseGuards(RolesGuard)
  @Post('/regadmin')
  loginAdmin(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto, true);
  }

  @Get()
  findAll() {
    // return this.authService.findAll();
  }
}
