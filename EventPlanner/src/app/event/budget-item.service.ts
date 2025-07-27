import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BudgetItem } from './model/budget-item.model';
import { Observable } from 'rxjs';
import { environment } from '../../env/environment';
import { CreateBudgetItemDTO } from '../offering/model/create-budget-item-dto.models';
import { UpdateBudgetItemDTO } from '../offering/model/edit-budget-item-dto.model';
@Injectable({
  providedIn: 'root'
})
export class BudgetItemService {
  
  constructor(private httpClient: HttpClient) { }

  add(budgetItem:CreateBudgetItemDTO) : Observable<BudgetItem> {
    return this.httpClient.post<BudgetItem>(environment.apiHost + "/events/" + budgetItem.eventId + "/budget", budgetItem);
  }
  buy(eventId: number, offeringId: number): Observable<void> {
    return this.httpClient.put<void>(
      `${environment.apiHost}/events/${eventId}/budget/buy/${offeringId}`, null
    );
  }
  
  getByEvent(eventId: number): Observable<BudgetItem[]> {
    return this.httpClient.get<BudgetItem[]>(environment.apiHost + "/events/budget/" + eventId);
  }  
  updateAmount(eventId:number, budgetItemId: number, amount: UpdateBudgetItemDTO): Observable<BudgetItem> {
    return this.httpClient.put<BudgetItem>(environment.apiHost + "/events/" + eventId + "/budget/" + budgetItemId, amount);
  }
  delete(eventId: number, budgetItemId: number): Observable<void> {
      return this.httpClient.delete<void>(`${environment.apiHost}/events/${eventId}/budget/${budgetItemId}`);
  }    
}

