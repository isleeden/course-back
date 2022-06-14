import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './../users/users.schema';
import { UsersService } from 'src/users/users.service';
import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private async isCandidateExist(name: string) {
    const candidate = await this.usersService.findByName(name);
    if (candidate) {
      throw new BadRequestException('user with this name is exist');
    }
    return candidate;
  }

  private isLoginCorrect(user, passwordEquals) {
    if (user && passwordEquals) {
      return user;
    } else {
      throw new ForbiddenException('incorrect data');
    }
  }

  async registration(userDto: CreateUserDto) {
    await this.isCandidateExist(userDto.name);
    const hashPassword = await this.usersService.hashPassword(userDto.password);
    const user = await this.usersService.create({
      ...userDto,
      password: hashPassword,
    });
    return this.generateToken(user);
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.usersService.findByName(userDto.name);
    const passwordEquals = await this.usersService.comparePasswords(
      userDto.password,
      user.password,
    );
    return await this.isLoginCorrect(user, passwordEquals);
  }

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async generateToken(user: UserDocument) {
    const payload = { name: user.name, id: user._id };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
