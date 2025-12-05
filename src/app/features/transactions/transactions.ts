import { Component } from '@angular/core';
import { AuthService } from '../../core/auth/services/auth';
import { Router } from '@angular/router';
import { TransactionList } from './transaction-list/transaction-list';
import { TransactionForm } from "./transaction-form/transaction-form";
import { FormsModule } from '@angular/forms';
import { TransactionResponse } from '../../shared/models/transactions/transaction-response/transaction-response';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [TransactionList, TransactionForm, FormsModule],
  templateUrl: './transactions.html',
  styleUrls: ['./transactions.css']
})
export class TransactionsComponent {
  isFormVisible : boolean  = false;
  isEdit : boolean = false;
  selectedTransaction : TransactionResponse | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private transactionList: TransactionList
  ) {
  }

  onShowForm(isVisible : boolean) {
    this.isFormVisible = isVisible;
  }

  public logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

