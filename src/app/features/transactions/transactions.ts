import { Component } from '@angular/core';
import { AuthService } from '../../core/auth/services/auth';
import { Router } from '@angular/router';
import { TransactionList } from './transaction-list/transaction-list';
import { TransactionForm } from "./transaction-form/transaction-form";
import { FormsModule } from '@angular/forms';
import { TransactionResponse } from '../../shared/models/transactions/transaction-response/transaction-response';
import { MatDialog } from '@angular/material/dialog';
import { TransactionRefreshService } from '../../core/transaction/services/transaction-refresh';
import { TransactionDeleteForm } from './transaction-delete-form/transaction-delete-form';

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
    private dialog: MatDialog,
    private transctionRefreshService: TransactionRefreshService,
  ) {
  }

  onShowForm(isVisible: boolean) {
    this.isFormVisible = isVisible;
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(TransactionForm, {
      width: '600px',
      data: {
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.transctionRefreshService.triggerRefresh();
      }
    });
  }

  openEditDialog(transaction: TransactionResponse) {
    const dialogRef = this.dialog.open(TransactionForm, {
      width: '600px',
      data: {
        isEdit: true,
        selectedTransaction: transaction
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.transctionRefreshService.triggerRefresh();
      }
    });
  }

  openDeleteDialog(transaction: TransactionResponse) {
    const dialogRef = this.dialog.open(TransactionDeleteForm, {
      width: '500px',
      data: {
        selectedTransaction: transaction
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.transctionRefreshService.triggerRefresh();
      }
    });
  }

  public logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

