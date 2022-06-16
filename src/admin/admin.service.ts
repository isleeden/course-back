import Roles from 'src/types/roles';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminService {
  constructor(private usersService: UsersService) {}

  async giveAdmin(id: string) {
    return await this.usersService.updateUser(id, { role: Roles.Admin });
  }

  async takeAdmin(id: string) {
    return await this.usersService.updateUser(id, { role: Roles.User });
  }

  async blockUser(id: string) {
    return await this.usersService.updateUser(id, { blocked: true });
  }

  async unblockUser(id: string) {
    return await this.usersService.updateUser(id, { blocked: false });
  }
}
