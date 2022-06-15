import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export const RolesDecorator = (role) => SetMetadata(ROLES_KEY, role);
