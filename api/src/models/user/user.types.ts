import { Role } from "../../lib/enums/role.enum";

export interface User {
  name: string;
  email: string;
  password: string;
  role: Role.TEACHER | Role.STUDENT | Role.ADMIN;
}
