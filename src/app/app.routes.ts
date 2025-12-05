import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { TransactionsComponent } from './features/transactions/transactions';
import { authGuard } from './core/auth/guards/auth-guard';
import { reverseAuthGuard } from './core/auth/guards/reverse-auth-guard';

export const routes: Routes = [{
  path: 'login',
  component: LoginComponent,
  canActivate: [reverseAuthGuard]
},
{
  path: 'register',
  component: RegisterComponent,
  canActivate: [reverseAuthGuard]
},
{
  path: 'transactions',
  component: TransactionsComponent,
  canActivate: [authGuard]
},
];
