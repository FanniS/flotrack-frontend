import { User } from "../../auth/user/user";

export interface ExpenseCategory {
  id: number;
  name: string;
  user: User;
}
