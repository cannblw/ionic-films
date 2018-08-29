import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Film } from '../../models/Film';
import { FilmProvider } from '../../providers/film/film';

import { DetailPage } from '../detail/detail';


@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  // Inicializa un array de tamaño variable para guardar las películas.
  films: Film[] = [];

  // Inicializa una string que tendrá un binding bidireccional con la vista.
  searchTerm: string = '';

  // Inicializa un boolean que será true si existe un error en las llamadas a la API.
  hasNetworkError: boolean = false;

  /*
   * Inyecta las dependencias. filmProvider se ha inyectado como privado
   * porque no se va a requerir un binding desde la vista.
   */
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private filmProvider: FilmProvider) { }

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
   * Llama a la función del provider que realiza una búsqueda en el servidor
   * dada una parte del nombre de la película.
   *
   * NOTA: No se utiliza el debounce de rxJS porque el propio componente de
   *       Ionic ya lleva su propio debounce incorporado con un tiempo de
   *       espera por defecto de 250 ms. Esto se considera suficiente.
   */
  onInput(): void {
    this.hasNetworkError = false;

    // Comprueba si el término de búsqueda está vacío. El componente es
    // responsable de su propio estado.
    if(this.searchTerm == '') {
      this.films = [];
    } else {
      this.filmProvider.search(this.searchTerm)
        .subscribe(films => {
          this.films = films.results;
        },
        _ => {
          this.hasNetworkError = true;
        });
    }
  }
}
