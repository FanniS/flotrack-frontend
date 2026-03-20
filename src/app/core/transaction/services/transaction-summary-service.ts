import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class TransactionSummaryService {
  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  getTransactionsByIsExpenseAndSumAmountByCategory(isExpense: boolean) {
    return this.http.get(
      environment.apiUrl + '/transactions/summary/amount/isExpense=' + isExpense,
      this.httpOptions
    )
  }

  getBalance() {
    return this.http.get<number>(
      environment.apiUrl + '/transactions/summary/balance',
      this.httpOptions
    )
  }


}
