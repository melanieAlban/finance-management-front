import { Injectable } from '@angular/core';
   import { Observable } from 'rxjs';
   import { ApiClientService } from '../shared/api/httpclient';

   export interface Investment {
     id?: number;
     name: string;
     initialAmount: number;
     returnRate: number;
     startDate: string;
     endDate: string;
     progress: number;
   }

   @Injectable({
     providedIn: 'root'
   })
   export class InvestmentService {
     private basePath = 'investment'; 

     constructor(private api: ApiClientService) {}

     getAll(): Observable<Investment[]> {
       return this.api.get<Investment[]>(this.basePath);
     }

     create(investment: Investment): Observable<Investment> {
       console.log('Enviando inversión para crear:', JSON.stringify(investment, null, 2));
       return this.api.post<Investment>(this.basePath, investment);
     }

     update(investment: Investment): Observable<Investment> {
       if (!investment.id && investment.id !== 0) {
         throw new Error('El ID de la inversión es requerido para la actualización');
       }
       console.log('Enviando inversión para actualizar:', JSON.stringify(investment, null, 2));
       return this.api.put<Investment>(this.basePath, investment);
     }

     delete(id: number): Observable<void> {
       return this.api.delete<void>(`${this.basePath}/${id}`);
     }
   }