import { UserRoles } from '../enums';
export interface TokenInterface {
  _id: string;
  username: string;
  role: UserRoles;
}
