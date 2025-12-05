import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TransactionResponse } from "../../../shared/models/transactions/transaction-response/transaction-response";
import { Observable } from "rxjs/internal/Observable";
import { TransactionRequest } from "../../../shared/models/transactions/transaction-request/transaction-request";
import { environment } from '../../../../environments/environment';
import { PageResponse } from "../../../shared/models/transactions/page-response/page-response";
import { IncomeCategory } from "../../../shared/models/categories/income-category/income-category";
import { ExpenseCategory } from "../../../shared/models/categories/expense-category/expense-category";

@Injectable({ providedIn: 'root' })
export class TransactionService {
  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  // START: CRUD for Transactions

  getTransactions(page: number, size: number): Observable<PageResponse<TransactionResponse>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<PageResponse<TransactionResponse>>(
      environment.apiUrl + '/transactions/manage',
      {
        ...this.httpOptions,
        params: params
      }
    )
  }

  addTransaction(transaction: TransactionRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(
      environment.apiUrl + '/transactions/create',
      transaction,
      this.httpOptions
    )
  }

  updateTransaction(id: number, transaction: TransactionRequest): Observable<TransactionResponse> {
    return this.http.put<TransactionResponse>(
      environment.apiUrl + '/transactions/update/' + id,
      transaction,
      this.httpOptions
    )
  }

  deleteTransaction(id: number) {
    return this.http.delete(
      environment.apiUrl + '/transactions/delete/' + id,
      this.httpOptions
    )
  }

  // END: CRUD for Transactions
}
