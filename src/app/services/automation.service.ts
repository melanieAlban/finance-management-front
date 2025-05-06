// src/app/services/automation.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../shared/api/httpclient';

export interface Automation {
  id?: number;
  amount: number;
  name: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  startDate: string; 
  lastExecutionDate?: string;
  userId?: number;
  accountId: number;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class AutomationService {
  private basePath = 'automation';

  constructor(private api: ApiClientService) {}

  getAll(): Observable<Automation[]> {
    return this.api.get<Automation[]>(this.basePath);
  }

  create(automation: Automation): Observable<Automation> {
    return this.api.post<Automation>(this.basePath, automation);
  }

  update(automation: Automation): Observable<Automation> {
    if (!automation.id && automation.id !== 0) {
      throw new Error('El ID de la automatización es requerido para la actualización');
    }
    return this.api.put<Automation>(this.basePath, automation);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.basePath}/${id}`);
  }
}