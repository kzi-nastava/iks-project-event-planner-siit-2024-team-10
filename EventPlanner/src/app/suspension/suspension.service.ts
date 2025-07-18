import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../env/environment';
import { AccountReport } from './model/account-report.model';
import { CreateAccountReportDTO } from './model/create-account-report-dto.model';

@Injectable({
  providedIn: 'root'
})
export class SuspensionService {

  constructor(private httpClient: HttpClient) {}

  sendReport(report:CreateAccountReportDTO): Observable<AccountReport>{
    return this.httpClient.post<AccountReport>(environment.apiHost + "/reports", report);
  }
}
