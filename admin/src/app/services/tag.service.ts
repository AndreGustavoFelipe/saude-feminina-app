import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tag } from '../models/tag.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TagService {
  private url = `${environment.apiUrl}/tags`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Tag[]> {
    return this.http.get<{ data: Tag[] }>(this.url).pipe(map(res => res.data));
  }

  getById(id: number): Observable<Tag> {
    return this.http.get<{ data: Tag }>(`${this.url}/${id}`).pipe(map(res => res.data));
  }

  create(data: { name: string }): Observable<Tag> {
    return this.http.post<{ data: Tag }>(this.url, data).pipe(map(res => res.data));
  }

  update(id: number, data: { name: string }): Observable<Tag> {
    return this.http.put<{ data: Tag }>(`${this.url}/${id}`, data).pipe(map(res => res.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
