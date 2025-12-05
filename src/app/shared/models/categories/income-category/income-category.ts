import { User } from "../../auth/user/user";

export interface IncomeCategory {
  id: number;
  name: string;
  user: User;
}
