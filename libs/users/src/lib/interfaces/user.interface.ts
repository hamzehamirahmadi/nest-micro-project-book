import { UserRoles } from "@libs/auth-lib";

export interface UserInterface {
  _id?: string;
  fullName: string;
  username: string;
  role?: UserRoles;
  password?: string;
  refreshToken?: string;
}
