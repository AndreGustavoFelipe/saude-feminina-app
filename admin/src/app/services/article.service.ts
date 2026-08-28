import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Article, ArticleFilters } from '../models/article.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private adminUrl = `${environment.apiUrl}/admin/articles`;

  constructor(private http: HttpClient) { }

  getAll(filters?: ArticleFilters): Observable<Article[]> {
    let params = new HttpParams();
    if (filters?.category_id) {
      params = params.set('category_id', filters.category_id.toString());
    }
    if (filters?.tag_id) {
      params = params.set('tag_id', filters.tag_id.toString());
    }
    if (filters?.life_phase_id) {
      params = params.set('life_phase_id', filters.life_phase_id.toString());
    }
    if (filters?.status) {
      params = params.set('status', filters.status);
    }

    return this.http.get<{ data: Article[] }>(this.adminUrl, { params }).pipe(map(res => res.data));
  }

  getById(id: number): Observable<Article> {
    return this.http.get<{ data: Article }>(`${this.adminUrl}/${id}`).pipe(map(res => res.data));
  }

  create(data: FormData): Observable<Article> {
    return this.http.post<{ data: Article }>(this.adminUrl, data).pipe(map(res => res.data));
  }

  update(id: number, data: FormData): Observable<Article> {
    data.append('_method', 'PUT');
    return this.http.post<{ data: Article }>(`${this.adminUrl}/${id}`, data).pipe(map(res => res.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/${id}`);
  }
}
