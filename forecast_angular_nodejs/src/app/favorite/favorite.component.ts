import { Component, OnInit } from '@angular/core';
import { FavoriteStorageService } from '../favorite-storage.service';

import { Favorite } from '../favorite-class';
import { ForecastService } from '../forecast.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {
  favoriteData : Favorite[];
  no_data : boolean;
  constructor(private favoriteService: FavoriteStorageService,
              private forecastService: ForecastService) {

               }

  ngOnInit() {
    this.favoriteData = this.favoriteService.getFavorites();
    // console.log('favoriteData from local in favorite component', this.favoriteData);
    this.checkFavoriteDataNum();

    this.favoriteService.getFavoriteStatus().subscribe(
      data => {
        this.favoriteData = data;
        // console.log('in Favorite Component, favorite data', this.favoriteData);
        // console.log('in Favorite component : got the change in favorite triggered from result');
      }
    )
  }

  deleteFavorite(f_city, f_state) {
    this.favoriteData = this.favoriteService.deleteFavorites(f_city, f_state);
    // console.log('favorite data after delete in favorite component', this.favoriteData );
    this.checkFavoriteDataNum();
    // console.log('in favorite component number of local data', this.favoriteData.length, this.no_data);
  }

  checkFavoriteDataNum() {
    if (this.favoriteData === null || this.favoriteData.length === 0) {
      this.no_data = true;
    }
    else {
      this.no_data = false;
    }
    // console.log('no_data? local data', this.no_data);
  }

  clickFavoriteCity(lat, lng, sealAddress, city, state) {
    this.forecastService.gotData = false;
    var userLocation = lat+','+lng;
    // console.warn('clickFavoriteCity', userLocation);
    var forecastData = [{seal : sealAddress, weather: null, success: false}];
    this.forecastService.city = city;
    this.forecastService.state = state;
    this.forecastService.getForecastResult(userLocation, forecastData);
    this.forecastService.updateForecastStatus(false);
  }

}
