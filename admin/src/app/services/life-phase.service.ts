import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LifePhase } from '../models/life-phase.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LifePhaseService {
  private url = `${environment.apiUrl}/life-phases`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<LifePhase[]> {
    return this.http.get<{ data: LifePhase[] }>(this.url).pipe(map(res => res.data));
  }

  getById(id: number): Observable<LifePhase> {
    return this.http.get<{ data: LifePhase }>(`${this.url}/${id}`).pipe(map(res => res.data));
  }

  create(data: { name: string }): Observable<LifePhase> {
    return this.http.post<{ data: LifePhase }>(this.url, data).pipe(map(res => res.data));
  }

  update(id: number, data: { name: string }): Observable<LifePhase> {
    return this.http.put<{ data: LifePhase }>(`${this.url}/${id}`, data).pipe(map(res => res.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
