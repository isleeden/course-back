import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CreateUserDto } from './../users/dto/create-user.dto';
import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
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

  @Get('/refresh')
  refreshToken(@Query() token: RefreshTokenDto) {
    return this.authService.refreshToken(token.token);
  }
}
