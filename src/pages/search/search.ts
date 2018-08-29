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
  searchTerm: string = '';
  films: Film[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private filmProvider: FilmProvider) { }

  itemTapped(event, film): void {
    this.navCtrl.push(DetailPage, {
      film: film
    });
  }

  onInput(): void {
    if(this.searchTerm == '') {
      this.films = [];
    } else {
      this.filmProvider.search(this.searchTerm)
        .subscribe(films => {
          this.films = films.results;
        });
    }
    console.log(this.films);
  }
}
