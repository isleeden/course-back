import Roles from 'src/types/roles';
export class CreateUserDto {
  readonly name: string;
  readonly password: string;
  role = Roles.User;
}
