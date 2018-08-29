import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Film } from '../../models/Film';

import { API_BASE, API_KEY } from '../../../config.js'

@Injectable()
export class FilmProvider {
  constructor(public http: HttpClient) { }

  getTopFilms(page = 1): Observable<Film> {
    const endPoint = '/discover/movie';
    const params = new HttpParams()
      .set('api_key', API_KEY)
      .set('sort_by', 'popularity.desc')
      .set('page', page);

    return this.http.get<Film[]>(API_BASE + endPoint, {params: params});
  }
}
