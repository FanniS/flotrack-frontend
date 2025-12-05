import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryService } from '../../../core/transaction/services/category-service';
import { TransactionResponse } from '../../../shared/models/transactions/transaction-response/transaction-response';
import { IncomeCategory } from '../../../shared/models/categories/income-category/income-category';
import { ExpenseCategory } from '../../../shared/models/categories/expense-category/expense-category';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { TransactionService } from '../../../core/transaction/services/transaction-service';
import e from 'express';

@Component({
  selector: 'app-transaction-form',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.css'
})
export class TransactionForm {
  @Input() selectedTransaction: TransactionResponse | null = null;
  @Input() isEdit : boolean = false;

  transactionForm: FormGroup;
  loading: boolean = false;
  incomeCategories: IncomeCategory[] = [];
  expenseCategories: ExpenseCategory[] = [];
  categoryOptions: IncomeCategory[] | ExpenseCategory[] = [];
  transactionError : string | null = null;

  @Output() isFormVisible = new EventEmitter<boolean>();

  constructor(private categoryService: CategoryService, private transactionService: TransactionService) {
    this.transactionForm = new FormGroup({
      isExpense: new FormControl(true),
      categoryId: new FormControl('', [Validators.required]),
      categoryOptions: new FormControl<IncomeCategory[] | ExpenseCategory[]>([]),
      amount: new FormControl(0, [Validators.required, Validators.min(0.01), Validators.pattern("^[0-9]+(\\.[0-9]{1,2})?")]),
      date: new FormControl(new Date()),
      description: new FormControl('')
    })
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

  onNgInit(){
    this.loadCategories();
  }

  hideForm() {
    this.transactionForm.reset();
    this.isFormVisible.emit(false);
  }
  // START: Populate and handle categories

  loadCategories() {
    this.loadIncomeCategories();
    this.loadExpenseCategories();
  }

  loadIncomeCategories() {
    this.loading = true;
    this.categoryService.getIncomeCategories().subscribe({
      next: categoryData => {
        this.incomeCategories = categoryData;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        console.error("Error while loading income categories!")
      }
    });
  }

  loadExpenseCategories() {
    this.loading = true;
    this.categoryService.getExpenseCategories().subscribe({
      next: categoryData => {
        this.expenseCategories = categoryData;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        console.error("Error while loading expense categories!")
      }
    });
  }

  updateCategoryOptions() {
    const isExpense = this.transactionForm.get('isExpense')?.value;
    this.categoryOptions = isExpense ? this.expenseCategories : this.incomeCategories;

  }

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
      this.transactionService.addTransaction(transactionRequest).subscribe({
        next: (response) => {
          this.transactionForm.reset();
          console.log('Transaction successful', response);
          this.isFormVisible.emit(false);
          window.location.reload();
        },
        error: (error) => {
          this.transactionError = error?.error?.message || 'Transaction failed. Please try again.';
        }
      });
    }
    else {
      this.transactionError = 'Please fill out all required fields correctly.';
    }
  }
  // END: Populate and handle categories
}
