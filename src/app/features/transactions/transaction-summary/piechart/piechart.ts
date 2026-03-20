import { Component } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TransactionSummaryService } from '../../../../core/transaction/services/transaction-summary-service';
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { TransactionRefreshService } from '../../../../core/transaction/services/transaction-refresh';

@Component({
  selector: 'app-piechart',
  imports: [BaseChartDirective, ReactiveFormsModule],
  templateUrl: './piechart.html',
  styleUrl: './piechart.css'
})
export class Piechart {
  pieChartType: ChartType = 'pie';
  piechartForm: FormGroup;
  mapOfCategoriesAndAmountsExpense: Map<string, number> = new Map<string, number>();
  mapOfCategoriesAndAmountsIncome: Map<string, number> = new Map<string, number>();
  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  };

  constructor(
    private transactionSummaryService: TransactionSummaryService,
    private transactionRefreshService: TransactionRefreshService,
  ) {
    this.piechartForm = new FormGroup({ currentIsExpense: new FormControl(true) })
  };

  get currentIsExpenseControl() {
    return this.piechartForm.get('currentIsExpense');
  }

  ngOnInit() {
    this.getDataForPieChart();

    this.piechartForm.get('currentIsExpense')?.valueChanges.subscribe(value => {
      this.updatePieChart();
    });

    this.transactionRefreshService.refresh$.subscribe(() => {
      this.getDataForPieChart();
    });
  }

  getDataForPieChart() {
    this.transactionSummaryService.getTransactionsByIsExpenseAndSumAmountByCategory(true).subscribe({
      next: data => {
        this.mapOfCategoriesAndAmountsExpense = new Map<string, number>(Object.entries(data));
        this.updatePieChart();
      },
      error: err => {
        console.error('Error fetching data for pie chart:', err);
      }
    });

    this.transactionSummaryService.getTransactionsByIsExpenseAndSumAmountByCategory(false).subscribe({
      next: data => {
        this.mapOfCategoriesAndAmountsIncome = new Map<string, number>(Object.entries(data));
        this.updatePieChart();
      },
      error: err => {
        console.error('Error fetching data for pie chart:', err);
      }
    });

  }

  updatePieChart() {
    if (this.currentIsExpenseControl?.value) {
      this.pieChartData = {
        labels: Array.from(this.mapOfCategoriesAndAmountsExpense.keys()),
        datasets: [
          {
            data: Array.from(this.mapOfCategoriesAndAmountsExpense.values()),
          }
        ]
      };
    }
    else {
      this.pieChartData = {
        labels: Array.from(this.mapOfCategoriesAndAmountsIncome.keys()),
        datasets: [
          {
            data: Array.from(this.mapOfCategoriesAndAmountsIncome.values()),
          }
        ]
      };
    }
  }

}
