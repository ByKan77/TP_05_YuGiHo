import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Card, CardResponse, CardFilters } from '../models';

@Injectable({ providedIn: 'root' })
export class CardApiService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  getCards(filters: CardFilters = {}, num = 20, offset = 0): Observable<CardResponse> {
    let params = new HttpParams().set('num', num).set('offset', offset);

    if (filters.fname) params = params.set('fname', filters.fname);
    if (filters.type) params = params.set('type', filters.type);
    if (filters.attribute) params = params.set('attribute', filters.attribute);
    if (filters.archetype) params = params.set('archetype', filters.archetype);

    return this.http.get<CardResponse>(`${this.base}/cardinfo.php`, { params });
  }

  getCardById(id: number): Observable<Card> {
    const params = new HttpParams().set('id', id);
    return this.http
      .get<CardResponse>(`${this.base}/cardinfo.php`, { params })
      .pipe(map((res) => res.data[0]));
  }

  // randomcard.php n'envoie pas les en-têtes CORS → on passe par cardinfo.php
  getRandomCard(): Observable<Card> {
    const bootstrap = new HttpParams().set('num', '1').set('offset', '0');
    return this.http
      .get<CardResponse>(`${this.base}/cardinfo.php`, { params: bootstrap })
      .pipe(
        switchMap((res) => {
          const total = res.meta?.total_rows ?? 1;
          const offset = Math.floor(Math.random() * total);
          const params = new HttpParams().set('num', '1').set('offset', offset);
          return this.http.get<CardResponse>(`${this.base}/cardinfo.php`, { params });
        }),
        map((res) => res.data[0]),
      );
  }
}
