import { Component } from '@angular/core';
import { Piechart } from './piechart/piechart';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { TransactionSummaryService } from '../../../core/transaction/services/transaction-summary-service';
import { TransactionRefreshService } from '../../../core/transaction/services/transaction-refresh';


@Component({
  selector: 'app-transaction-summary',
  imports: [Piechart],
  templateUrl: './transaction-summary.html',
  styleUrl: './transaction-summary.css'
})
export class TransactionSummary {
  balance: string = '0.00';

  constructor(
    private transactionSummaryService: TransactionSummaryService,
    private transactionRefreshService: TransactionRefreshService
  ) {}

  ngOnInit() {
    this.calculateBalance();

    this.transactionRefreshService.refresh$.subscribe(() => {
      this.calculateBalance();
    });
  }

  calculateBalance() {
    this.transactionSummaryService.getBalance().subscribe({
      next: balance => {
        this.balance = balance.toPrecision(4);
      },
      error: err => {
        this.balance = '0.00';
        console.error('Error fetching balance:', err);
      }
    });
  }

}
