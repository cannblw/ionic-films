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
  // Inicializa un array de tamaño variable para guardar las películas.
  films: Film[] = [];

  // Inicializa el número de página actual a 1.
  page: number = 1;

  // Inicializa una variable que contendrá el número total de páginas disponibles
  // en el momento de la construcción de la clase.
  totalPages: number;

  // Inicializa un boolean que será true si la lista está cargando elementos
  // para bloquear dicha acción hasta que la anterior termine.
  isLoading: boolean = false;

  // Inicializa un boolean que determinará si se ha alcanzado el final de la lista.
  hasReachedListEnd: boolean = false;

  // Inicializa un boolean que será true si existe un error en las llamadas a la API.
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
      _ => {
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
      _ => {
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
   * Carga la siguiente página de películas una vez se ha alcanzado el final
   * de la página actual.
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
