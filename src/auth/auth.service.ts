import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './../users/users.schema';
import { UsersService } from 'src/users/users.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registration(userDto: CreateUserDto) {
    const candidate = await this.usersService.findByName(userDto.name);
    if (candidate) {
      throw new BadRequestException('user with this name is exist');
    }
    const hashPassword = await this.usersService.hashPassword(userDto.password);
    const user = await this.usersService.create({
      ...userDto,
      password: hashPassword,
    });
    return this.generateToken(user);
  }

  login(userDto: CreateUserDto) {
    return `This action returns all auth`;
  }

  async generateToken(user: UserDocument) {
    const payload = { name: user.name, id: user._id };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
