import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Film } from '../../models/Film';
import { FilmProvider } from '../../providers/film/film';

import { DetailPage } from '../detail/detail';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  // Variables sobre las películas
  films: Film[] = [];
  page: number = 1;
  totalPages: number;

  // Variables de estado
  isLoading: boolean = false;
  hasReachedListEnd: boolean = false;
  hasNetworkError: boolean = false;

  /*
   * Inyecta las dependencias. filmProvider se ha inyectado como privado
   * porque no se va a requerir un binding desde la vista.
   */
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private filmProvider : FilmProvider) {

    /*
     * Almacena las películas en un array que se utilizará como contenido
     * de la lista a mostrar.
     */
    this.getFilms();

    /*
     * Recibe el número de páginas totales para saber cuándo detener
     * el scroll infinito.
    */
    this.getTotalPages();
  }

  /*
   * Obtiene las películas a mostrar en la lista mediante la suscripción
   * a un observer del provider de películas. Una vez se obtengan, se añadirán
   * a un array el cuál la lista leerá.
   */
  getFilms(page = 1): void {
    this.isLoading = true;
    this.hasNetworkError = false;

    this.filmProvider.getTopFilms(page)
      .subscribe(films => {
        this.films = this.films.concat(films.results as Film[]);
        this.isLoading = false;
      },
      _ => { // Maneja el error de una forma genérica
        this.hasNetworkError = true;
      });
  }

  /*
   * Obtiene el número total de películas para saber cuándo detener
   * el scroll infinito.
   */
  getTotalPages(): void {
    this.hasNetworkError = false;

    this.filmProvider.getTopFilms()
      .subscribe(films => {
        this.totalPages = films.total_pages;
      },
      _ => { // Maneja el error de una forma genérica
        this.hasNetworkError = true;
      });
  }

  /*
   * Espera al listener _(click)_ para cada elemento de la lista.
   * Lleva a la página de detalles con la información de la
   * película seleccionada.
   */
  itemTapped(event, film): void {
    this.navCtrl.push(DetailPage, {
      film: film
    });
  }

  /*
   * Redirige al usuario a la página de búsqueda.
   */
  searchClicked(): void {
    this.navCtrl.push(SearchPage);
  }

  /*
   * Carga la siguiente página de películas realizando una llamada
   * a la api.
   */
  loadMore(infiniteScroll): void {
    // Si está cargando o se ha alcanzado la última página, no hacer nada.
    if (this.isLoading || this.hasReachedListEnd) {
      infiniteScroll.complete();
      return;
    };

    // Incrementa el valor de la página actual.
    const nextPage = ++this.page;

    // Si se alcanza el final de la lista, desactivarla y hacer
    // la variable hasReachedListEnd true.
    if (nextPage > this.totalPages) {
      this.hasReachedListEnd = true;
      infiniteScroll.enable(false);
      return;
    }

    // Obtener las películas del servidor.
    this.getFilms(nextPage);
    infiniteScroll.complete();
  }
}
