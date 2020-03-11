import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AppConfig} from '../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private httpClient: HttpClient) {}

  search(searchText: string, fromYear: number, toYear: number, from: number, pageSize: number): Observable<any> {
    return this.httpClient.get<any>(AppConfig.searchApi(searchText, fromYear, toYear, from - 1, pageSize));
  }

  getDocWithId(id: any) {
    return this.httpClient.get<any>(AppConfig.getDocWithIdApi(id));
  }
}
