import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IncomeCategory } from "../../../shared/models/categories/income-category/income-category";
import { Observable } from "rxjs/internal/Observable";
import { environment } from "../../../../environments/environment";
import { ExpenseCategory } from "../../../shared/models/categories/expense-category/expense-category";


@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  // START: CRUD for Categories

  getIncomeCategories(): Observable<IncomeCategory[]> {
    return this.http.get<IncomeCategory[]>(
      environment.apiUrl + '/categories/income',
      this.httpOptions
    )
  }

  getExpenseCategories(): Observable<ExpenseCategory[]> {
    return this.http.get<ExpenseCategory[]>(
      environment.apiUrl + '/categories/expense',
      this.httpOptions
    )
  }

  createIncomeCategory(incomeCategory: IncomeCategory): Observable<IncomeCategory> {
    return this.http.post<IncomeCategory>(
      environment.apiUrl + '/categories/income/create',
      incomeCategory,
      this.httpOptions
    )
  }

  createExpenseCategory(expenseCategory: ExpenseCategory): Observable<ExpenseCategory> {
    return this.http.post<ExpenseCategory>(
      environment.apiUrl + '/categories/expense/create',
      expenseCategory,
      this.httpOptions
    )
  }

  deleteIncomeCategory(id: number) {
    return this.http.delete(
      environment.apiUrl + '/categories/income/delete/' + id,
      this.httpOptions
    )
  }

  deleteExpenseCategory(id: number) {
    return this.http.delete(
      environment.apiUrl + '/categories/expense/delete/' + id,
      this.httpOptions
    )
  }

  // END: CRUD for Categories

}
