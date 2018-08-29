import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE, API_KEY } from '../../../config.js'

@Injectable()
export class FilmProvider {
  constructor(public http: HttpClient) { }

  getTopFilms(page: number = 1): Observable<Object> {
    const endPoint = '/discover/movie';
    const params = new HttpParams()
      .set('api_key', API_KEY)
      .set('sort_by', 'popularity.desc')
      .set('page', String(page));

    return this.http.get(API_BASE + endPoint, { params: params });
  }
}
