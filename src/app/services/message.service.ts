import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../shared/api/httpclient';

export interface MessageDto {
  type: 'INFO' | 'ERROR' | 'WARNING';
  content: string;
  timestamp: string; 
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private basePath = 'message'; 

  constructor(private api: ApiClientService) {}

  getAll(): Observable<MessageDto[]> {
    return this.api.get<MessageDto[]>(this.basePath);
  }

}
