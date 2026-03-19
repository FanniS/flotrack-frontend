import { Component } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { PiechartService } from '../../../../core/transaction/services/piechart-service';
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
  currentIsExpense: boolean = true;
  piechartForm: FormGroup;
  mapOfCategoriesAndAmounts: Map<string, number> = new Map<string, number>();
  mapOfCategoriesAndAmountsPercentage: Map<string, number> = new Map<string, number>();
  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  };

  constructor(
    private piechartService: PiechartService,
    private transactionRefreshService: TransactionRefreshService
  ) {
    this.piechartForm = new FormGroup({ currentIsExpense: new FormControl(true) }),
    this.getDataForPieChart(this.currentIsExpense)
  };

  get isExpenseControl() {
    return this.piechartForm.get('currentIsExpense');
  }
  ngOnInit() {
    this.getDataForPieChart(this.currentIsExpense);

    this.piechartForm.get('currentIsExpense')?.valueChanges.subscribe(value => {
      this.updatePieChart(value);
    });

    this.transactionRefreshService.refresh$.subscribe(() => {
      this.getDataForPieChart(this.currentIsExpense);
    });
  }

  getDataForPieChart(currentIsExpense: boolean) {
    this.piechartService.getTransactionsByIsExpenseAndSumAmountByCategory(currentIsExpense).subscribe({
      next: data => {
        this.mapOfCategoriesAndAmounts = new Map<string, number>(Object.entries(data));
        this.pieChartData = {
      labels: Array.from(this.mapOfCategoriesAndAmounts.keys()),
      datasets: [
        {
          data: Array.from(this.mapOfCategoriesAndAmounts.values()),
        }
      ]
    };
      },
      error: err => {
        console.error('Error fetching data for pie chart:', err);
      }
    });
  }

  updatePieChart(isExpense: boolean) {
    this.getDataForPieChart(isExpense);
  }

}
