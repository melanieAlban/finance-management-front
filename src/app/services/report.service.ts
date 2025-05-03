import { Injectable } from '@angular/core';
import { ApiClientService } from '../shared/api/httpclient';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private api:ApiClientService) { }

  getReport() {
    return this.api.get<any>('report');
  }

  
}
