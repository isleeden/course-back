import { JwtService } from '@nestjs/jwt';
import { UserDocument } from './../users/users.schema';
import { UsersService } from 'src/users/users.service';
import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import Roles from 'src/types/roles';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registration(userDto: CreateUserDto, isAdmin = false) {
    await this.isCandidateExist(userDto.name);
    const hashPassword = await this.usersService.hashPassword(userDto.password);
    if (isAdmin) userDto.role = Roles.Admin;
    const user = await this.usersService.create({
      ...userDto,
      password: hashPassword,
    });
    const token = this.generateToken(user);
    return { token, user };
  }

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    const token = this.generateToken(user);
    return { token, user };
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.usersService.findByName(userDto.name);
    if (user.blocked) throw new ForbiddenException();
    const passwordEquals = await this.usersService.comparePasswords(
      userDto.password,
      user.password,
    );
    return await this.isLoginCorrect(user, passwordEquals);
  }

  private async generateToken(user: UserDocument) {
    const payload = { name: user.name, id: user._id, role: user.role };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async isCandidateExist(name: string) {
    const candidate = await this.usersService.findByName(name);
    if (candidate)
      throw new BadRequestException('user with this name is exist');
    return candidate;
  }

  private isLoginCorrect(user: UserDocument, passwordEquals: boolean) {
    if (user && passwordEquals) {
      return user;
    } else {
      throw new ForbiddenException('incorrect data');
    }
  }
}
