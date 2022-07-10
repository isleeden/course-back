import { AdminService } from './admin.service';
import { Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('admin')
@UseGuards(RolesGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Patch('give/:id')
  giveAdmin(@Param('id') id: string) {
    return this.adminService.giveAdmin(id);
  }

  @Patch('take/:id')
  takeAdmin(@Param('id') id: string) {
    return this.adminService.takeAdmin(id);
  }

  @Patch('block/:id')
  blockUser(@Param('id') id: string) {
    return this.adminService.blockUser(id);
  }

  @Patch('unblock/:id')
  unblockUser(@Param('id') id: string) {
    return this.adminService.unblockUser(id);
  }
}
