import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Symptom, SymptomLog, CreateSymptomLogDto, UpdateSymptomLogDto } from '../models/symptom.model';

@Injectable({
  providedIn: 'root'
})
export class SymptomService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getSymptoms(): Observable<Symptom[]> {
    return this.http.get<{ data: Symptom[] }>(`${this.baseUrl}/symptoms`)
      .pipe(map(res => res.data));
  }

  getSymptomLogs(startDate?: string, endDate?: string): Observable<SymptomLog[]> {
    let params = new HttpParams();
    if (startDate) params = params.set('start_date', startDate);
    if (endDate) params = params.set('end_date', endDate);
    return this.http.get<{ data: SymptomLog[] }>(`${this.baseUrl}/symptom-logs`, { params })
      .pipe(map(res => res.data));
  }

  createSymptomLog(data: CreateSymptomLogDto): Observable<SymptomLog> {
    return this.http.post<{ data: SymptomLog }>(`${this.baseUrl}/symptom-logs`, data)
      .pipe(map(res => res.data));
  }

  updateSymptomLog(id: number, data: UpdateSymptomLogDto): Observable<SymptomLog> {
    return this.http.put<{ data: SymptomLog }>(`${this.baseUrl}/symptom-logs/${id}`, data)
      .pipe(map(res => res.data));
  }

  deleteSymptomLog(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/symptom-logs/${id}`);
  }
}
