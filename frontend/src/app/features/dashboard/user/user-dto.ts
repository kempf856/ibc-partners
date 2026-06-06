import {Role} from '../../../shared/role';

export interface UserDto {
  id?: number;
  email: string;
  fullName: string;
  phone: string;
  referralCode? : string;
  roles: Role[];
}
