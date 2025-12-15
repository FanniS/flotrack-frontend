import { Component, Injectable, Input, Output } from '@angular/core';
import { TransactionResponse } from '../../../shared/models/transactions/transaction-response/transaction-response';
import { TransactionService } from '../../../core/transaction/services/transaction-service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { IncomeCategory } from '../../../shared/models/categories/income-category/income-category';
import { ExpenseCategory } from '../../../shared/models/categories/expense-category/expense-category';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-transaction-list',
  imports: [MatPaginatorModule],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.css',
})
export class TransactionList {
  transactions: TransactionResponse[] = [];
  loading: boolean = false;
  incomeCategories: IncomeCategory[] = [];
  expenseCategories: ExpenseCategory[] = [];

  @Output() addTransaction = new EventEmitter<void>();
  @Output() editTransaction = new EventEmitter<TransactionResponse>();

  page: number;
  size: number;
  totalTransactions: number;

  constructor(
    private transactionService: TransactionService
  ) {
    this.page = 0;
    this.size = 10;
    this.totalTransactions = 0;
    this.loadTransactions(this.page, this.size);
  }

  /*onNgInit() {
    this.loadTransactions(this.page, this.size);
  }*/

  /*
  *  Get data for the paginator and also to the table
  */
  getPaginatorData(page: number, size: number) {
    this.page = page;
    this.size = size;
    this.loadTransactions(page, size);
  }

  loadTransactions(page: number, size: number) {
    this.loading = true;
    this.transactionService.getTransactions(page, size).subscribe({
      next: pageData => {
        this.transactions = pageData.content;
        this.totalTransactions = pageData.totalElements;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        console.error("Error while loading transactions!")
      }
    }
    );
  }
  onAddClick() {
    this.addTransaction.emit();
  }

  onEditClick(transaction: TransactionResponse) {
    this.editTransaction.emit(transaction);
  }
}
