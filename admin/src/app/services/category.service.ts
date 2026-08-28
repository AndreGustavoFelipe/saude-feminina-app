import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from '../models/category.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private url = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<{ data: Category[] }>(this.url).pipe(map(res => res.data));
  }

  getById(id: number): Observable<Category> {
    return this.http.get<{ data: Category }>(`${this.url}/${id}`).pipe(map(res => res.data));
  }

  create(data: { name: string }): Observable<Category> {
    return this.http.post<{ data: Category }>(this.url, data).pipe(map(res => res.data));
  }

  update(id: number, data: { name: string }): Observable<Category> {
    return this.http.put<{ data: Category }>(`${this.url}/${id}`, data).pipe(map(res => res.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
