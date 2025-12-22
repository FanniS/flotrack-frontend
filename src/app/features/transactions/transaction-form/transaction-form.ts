import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from '../../../core/transaction/services/category-service';
import { TransactionResponse } from '../../../shared/models/transactions/transaction-response/transaction-response';
import { IncomeCategory } from '../../../shared/models/categories/income-category/income-category';
import { ExpenseCategory } from '../../../shared/models/categories/expense-category/expense-category';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { TransactionService } from '../../../core/transaction/services/transaction-service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { CommonModule } from '@angular/common';

export interface TransactionDialogData {
  selectedTransaction?: TransactionResponse | null;
  isEdit: boolean;
}

@Component({
  selector: 'app-transaction-form',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.css'
})

export class TransactionForm {
  transactionForm: FormGroup;
  loading: boolean = false;
  incomeCategories: IncomeCategory[] = [];
  expenseCategories: ExpenseCategory[] = [];
  categoryOptions: IncomeCategory[] | ExpenseCategory[] = [];
  transactionError: string | null = null;
  isEdit: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private transactionService: TransactionService,
    private dialogRef: MatDialogRef<TransactionForm>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionDialogData
  ) {
    this.transactionForm = new FormGroup({
      isExpense: new FormControl(true),
      categoryId: new FormControl('', [Validators.required]),
      amount: new FormControl(0, [
        Validators.required,
        Validators.min(0.01)
      ]),
      date: new FormControl(new Date()),
      description: new FormControl('')
    });

    this.isEdit = data.isEdit;
  }

  get isExpenseControl() {
    return this.transactionForm.get('isExpense');
  }

  get categoryIdControl() {
    return this.transactionForm.get('categoryId');
  }

  get amountControl() {
    return this.transactionForm.get('amount');
  }

  ngOnInit() {
    this.loadCategories();

    this.transactionForm.get('isExpense')?.valueChanges.subscribe(value => {
      this.updateCategoryOptions(value);
    });

    if (this.data.selectedTransaction) {
      const t = this.data.selectedTransaction;

      this.transactionForm.patchValue({
        isExpense: t.isExpense,
        amount: t.amount,
        date: t.date,
        description: t.description
      });

      setTimeout(() => {
        const categoryId = this.findCategoryIdByName(t.categoryName);
        if (categoryId) {
          this.transactionForm.patchValue({ categoryId });
        }
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  // START: Populate and handle categories

  loadCategories() {
    this.loading = true;
    forkJoin([
      this.categoryService.getIncomeCategories(),
      this.categoryService.getExpenseCategories()
    ]).subscribe(([income, expense]) => {
      this.incomeCategories = income;
      this.expenseCategories = expense;

      this.updateCategoryOptions(this.transactionForm.get('isExpense')?.value);

      if (this.data.selectedTransaction) {
        const id = this.findCategoryIdByName(this.data.selectedTransaction.categoryName);
        this.transactionForm.patchValue({ categoryId: id });
      }
    });
  }

  updateCategoryOptions(isExpense: boolean) {
    this.categoryOptions = isExpense
      ? this.expenseCategories
      : this.incomeCategories;

    this.transactionForm.get('categoryId')?.reset();
  }

  private findCategoryIdByName(name: string): number | null {
    const allCategories = [...this.incomeCategories, ...this.expenseCategories];
    const found = allCategories.find(c => c.name === name);
    return found ? found.id : null;
  }

  // END: Populate and handle categories

  onSubmit() {
    this.transactionError = null;
    if (this.transactionForm.valid) {
      const { isExpense, categoryId, amount, date, description } = this.transactionForm.value;
      const transactionRequest = {
        isExpense: isExpense,
        categoryId: categoryId,
        amount: amount,
        date: date,
        description: description
      };
      if (this.isEdit && this.data.selectedTransaction) {
        this.transactionService.updateTransaction(this.data.selectedTransaction.id, transactionRequest).subscribe({
          next: (response) => {
            this.transactionForm.reset();
            this.dialogRef.close(response);
            console.log('Transaction update successful', response);
          },
          error: (error) => {
            this.transactionError = error?.error?.message || 'Transaction failed. Please try again.';
          }
        });
      }
      else {
        this.transactionService.addTransaction(transactionRequest).subscribe({
          next: (response) => {
            this.transactionForm.reset();
            this.dialogRef.close(response);
            console.log('Transaction addition successful', response);
          },
          error: (error) => {
            this.transactionError = error?.error?.message || 'Transaction failed. Please try again.';
          }
        });
      }
    }
    else {
      this.transactionError = 'Please fill out all required fields correctly.';
    }
  }

}
