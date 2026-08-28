import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MenstrualCycle } from '../models/cycle.model';
import { CyclePrediction } from '../models/prediction.model';

@Injectable({
  providedIn: 'root'
})
export class CycleService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getCycles(): Observable<MenstrualCycle[]> {
    return this.http.get<{ data: MenstrualCycle[] }>(`${this.baseUrl}/cycles`)
      .pipe(map(res => res.data));
  }

  createCycle(startDate: string): Observable<MenstrualCycle> {
    return this.http.post<{ data: MenstrualCycle }>(`${this.baseUrl}/cycles`, { start_date: startDate })
      .pipe(map(res => res.data));
  }

  updateCycle(id: number, endDate: string): Observable<MenstrualCycle> {
    return this.http.put<{ data: MenstrualCycle }>(`${this.baseUrl}/cycles/${id}`, { end_date: endDate })
      .pipe(map(res => res.data));
  }

  deleteCycle(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cycles/${id}`);
  }

  getPredictions(): Observable<CyclePrediction> {
    return this.http.get<CyclePrediction>(`${this.baseUrl}/predictions`);
  }
}
