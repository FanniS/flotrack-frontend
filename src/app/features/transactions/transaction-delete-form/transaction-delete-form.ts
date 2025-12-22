import { Component, Inject } from '@angular/core';
import { TransactionResponse } from '../../../shared/models/transactions/transaction-response/transaction-response';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TransactionService } from '../../../core/transaction/services/transaction-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface TransactionDeleteDialogData {
  selectedTransaction?: TransactionResponse | null;
}

@Component({
  selector: 'app-transaction-delete-form',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './transaction-delete-form.html',
  styleUrl: './transaction-delete-form.css'
})
export class TransactionDeleteForm {
  transactionError: string | null = null;

  constructor(private transactionService: TransactionService,
    private dialogRef: MatDialogRef<TransactionDeleteForm>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionDeleteDialogData) {
  }

  cancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.transactionError = null;
    this.transactionService.deleteTransaction(this.data.selectedTransaction!.id).subscribe({
      next: () => {
        this.dialogRef.close(true);
        console.log('Transaction delete successful, id: ', this.data.selectedTransaction!.id);
      },
      error: (error) => {
        this.transactionError = error?.error?.message || 'Transaction deletion failed. Please try again.';
      }
    });
  }

}
