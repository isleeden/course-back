import { AdminService } from './admin.service';
import { Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RolesDecorator } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import Roles from 'src/types/roles';

@Controller('admin')
@UseGuards(RolesGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @RolesDecorator(Roles.Admin)
  @Patch("give/:id")
  giveAdmin(@Param('id') id: string) {
    return this.adminService.giveAdmin(id);
  }

  @RolesDecorator(Roles.Admin)
  @Patch("take/:id")
  takeAdmin(@Param('id') id: string) {
    return this.adminService.takeAdmin(id);
  }

  @RolesDecorator(Roles.Admin)
  @Patch('block/:id')
  blockUser(@Param('id') id: string) {
    return this.adminService.blockUser(id);
  }

  @RolesDecorator(Roles.Admin)
  @Patch('unblock/:id')
  unblockUser(@Param('id') id: string) {
    return this.adminService.unblockUser(id);
  }
}
