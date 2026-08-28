import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Article, Category } from '../models/article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getPublishedArticles(categoryId?: number): Observable<Article[]> {
    let params = new HttpParams();
    if (categoryId) {
      params = params.set('category_id', categoryId.toString());
    }
    return this.http.get<{ data: Article[] }>(`${this.baseUrl}/articles`, { params })
      .pipe(map(res => res.data));
  }

  getArticleById(id: number): Observable<Article> {
    return this.http.get<{ data: Article }>(`${this.baseUrl}/admin/articles/${id}`)
      .pipe(map(res => res.data));
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<{ data: Category[] }>(`${this.baseUrl}/categories`)
      .pipe(map(res => res.data));
  }
}
