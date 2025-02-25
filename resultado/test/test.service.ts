import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {MessageService} from 'primeng/api';
import { Test } from './test.type';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  
  private _url = `${environment.apiUrl}/test`

  private _httpClient = inject(HttpClient)

  private _messageService = inject(MessageService)

}