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
  film: Film;
  imgUri: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // Obtiene la película seleccionada para poder hacer un binding desde la vista.
    this.film = this.navParams.get('film');

    // Obtiene la uri completa del póster de la película
    this.imgUri = IMG_BASE + this.film.poster_path;
  }
}
