import { Component } from '@angular/core';
import { Piechart } from './piechart/piechart';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

@Component({
  selector: 'app-transaction-summary',
  imports: [Piechart],
  templateUrl: './transaction-summary.html',
  styleUrl: './transaction-summary.css'
})
export class TransactionSummary {

}
