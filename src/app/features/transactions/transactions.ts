import { Component } from '@angular/core';
import { AuthService } from '../../core/auth/services/auth';
import { Router } from '@angular/router';
import { TransactionList } from './transaction-list/transaction-list';
import { TransactionForm } from "./transaction-form/transaction-form";
import { FormsModule } from '@angular/forms';
import { TransactionResponse } from '../../shared/models/transactions/transaction-response/transaction-response';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [TransactionList, FormsModule],
  templateUrl: './transactions.html',
  styleUrls: ['./transactions.css']
})
export class TransactionsComponent {
  isFormVisible: boolean = false;
  isEdit: boolean = false;
  selectedTransaction: TransactionResponse | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {
  }

  onShowForm(isVisible: boolean) {
    this.isFormVisible = isVisible;
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(TransactionForm, {
      width: '500px',
      data: {
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // later: refresh list or update state
      }
    });
  }

  openEditDialog(transaction: TransactionResponse) {
    const dialogRef = this.dialog.open(TransactionForm, {
      width: '500px',
      data: {
        isEdit: true,
        selectedTransaction: transaction
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // later: update edited item
      }
    });
  }

  public logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

