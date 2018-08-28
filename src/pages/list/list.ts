import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Film } from '../../models/Film';
import { FilmProvider } from '../../providers/film/film';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  items: Array<{title: string, note: string, icon: string}>;

  films: Film[] = [];
  page: number = 1;
  totalPages: number;
  isLoading: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private filmProvider : FilmProvider) {

    // Get films
    this.getFilms();

    // Get total pages
    this.getTotalPages();

    this.items = [];
    for (let i=1; i<11; i++) {
      this.items.push({
        title: 'Item ' + i,
        note: 'This is item #' + i,
      });
    }
  }

  getFilms(page = 1): void {
    this.isLoading = true;

    this.filmProvider.getTopFilms(page)
      .subscribe(films => {
        this.films = this.films.concat(films.results);
        this.isLoading = false;
      });
  }

  getTotalPages(): number {
    return this.filmProvider.getTopFilms()
      .subscribe(films => {
        this.totalPages = films.total_pages;
      });
  }

  itemTapped(event, item): void {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ListPage, {
      item: item
    });
  }

  loadMore(infiniteScroll) {
    // If is loading or has loaded all results
    if (this.isLoading || this.hasReachedListEnd) {
      infiniteScroll.complete();
      return;
    };

    const nextPage = ++this.page;

    // Reached end of list
    if (nextPage > this.totalPages) {
      console.log('END REACHED')
      this.hasReachedListEnd = true;
      infiniteScroll.enable(false);
      return;
    }

    // Retrieve the films
    this.getFilms(nextPage);
    infiniteScroll.complete();
  }
}
