import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Film } from '../../models/Film';

import { IMG_BASE } from '../../../config';


@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {
  // Inicializa una variable que contendrá la película actual.
  film: Film;

  // Inicializa una string que contendrá la URI completa al poster de la película.
  posterUri: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // Obtiene la película seleccionada para poder hacer un binding desde la vista.
    this.film = this.navParams.get('film');

    // Obtiene la URI completa del póster de la película
    this.posterUri = IMG_BASE + this.film.poster_path;
  }
}
