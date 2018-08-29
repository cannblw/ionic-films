import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of'

import { API_BASE, API_KEY } from '../../../config.js'

@Injectable()
export class FilmProvider {
  constructor(public http: HttpClient) { }

  /*
   * Realiza una llamada a la API para obtener las películas más valoradas
   * en orden de popularidad descendente.
   */
  getTopFilms(page: number = 1): Observable<any> {
    const endPoint = '/discover/movie';
    const params = new HttpParams()
      .set('api_key', API_KEY)
      .set('sort_by', 'popularity.desc')
      .set('page', String(page));

    return this.http.get(API_BASE + endPoint, { params: params });
  }

  /*
   * Realiza una llamada a la API para obtener las películas que coinciden con
   * un determinado término de búsqueda.
   */
  search(term: string): Observable<any> {
    if(term == '') return of([]);

    const endPoint = '/search/movie';
    const params = new HttpParams()
      .set('api_key', API_KEY)
      .set('query', term);

    return this.http.get(API_BASE + endPoint, { params: params });
  }
}
