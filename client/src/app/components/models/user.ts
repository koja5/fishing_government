import { Role } from "../auth/models/role";
import { UserTypes } from "../dashboard/enums/user-types";

export class UserModel {
  id_owner: number;
  firstname: string;
  lastname: string;
  street: string;
  location: string;
  bidrtday: Date;
  email: string;
  username: string;
  password: string;
  type: UserTypes;
  active: boolean;
}
