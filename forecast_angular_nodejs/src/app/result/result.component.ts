import { Component, OnInit, ViewChild } from '@angular/core';
import { FavoriteStorageService } from '../favorite-storage.service';
import { ForecastService } from '../forecast.service';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TabsetComponent, TabDirective } from 'ngx-bootstrap/tabs';
import { Favorite } from '../favorite-class';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  @ViewChild('tabset', {static: false}) tabset: TabsetComponent;

  
  id : number;
  favoriteData : Favorite[] = null;
  forecastData : any[];
  gotData = false;
  city : string;
  state : string;
  seal : string;
  temperature : number;
  summary : string;
  latitude : number;
  longitude : number;
  isFavorite : boolean;
  dataReady = false;
  

  subscription: Subscription;
  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(private favorite: FavoriteStorageService, 
              private forecastService: ForecastService,) {
    // this.isFavorite = false;
    // this.subscription = this.forecastService.getWeatherData()
    // .pipe(takeUntil(this.ngUnsubscribe))
    // .subscribe(data => {
    //   if (data[0]['success']===true) {
    //     this.forecastData = data;
    //     this.extractData();
    //     console.log('forecastData subscribe in result');
    //     // this.printLog();
    //   }
    //   else {
    //     this.forecastData = null;
    //   }
    // });

    // this.forecastService.getForecastStatus()
    //   .pipe(takeUntil(this.ngUnsubscribe))  
    //   .subscribe(
    //   data => {
    //     this.gotData = data;
    //     console.log('gotData in result component', this.gotData);
    //     if (this.gotData == true) {
    //       console.warn('inside favoriteDataStatusObserver and gotData==true');
    //       // this.checkIsFavorite(this.city, this.state);
    //       // this.setActiveTab(0);
    //     }
    //     else {
    //       this.dataReady == false;
    //       console.warn('gotData, dataReady in result',this.gotData, this.dataReady);
    //     }
        
    // });

    // this.favoriteData = this.favorite.getFavorites();
                
  }

  ngOnInit() {
    this.favoriteData = this.favorite.getFavorites();

    this.favorite.getFavoriteStatus()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      data => {
        this.favoriteData = data;
        console.log('in result component : got the change in result triggered from favorite');
        this.checkIsFavorite(this.city, this.state);
      }
    )

    this.subscription = this.forecastService.getWeatherData()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(data => {
      if (data[0]['success']===true) {
        this.forecastData = data;
        this.extractData();
        console.log('forecastData subscribe in result');
        // this.printLog();
      }
      else {
        this.forecastData = null;
      }
    });

    this.forecastService.getForecastStatus()
      .pipe(takeUntil(this.ngUnsubscribe))  
      .subscribe(
      data => {
        this.gotData = data;
        this.dataReady = false;
        if (this.gotData == true) {
          console.warn('inside favoriteDataStatusObserver and gotData==true');
          // this.checkIsFavorite(this.city, this.state);
          // this.setActiveTab(0);
        }
        console.warn('gotData, dataReady in result',this.gotData, this.dataReady);
    });

    

    

    // this.favorite.removeFavorites();
    // this.checkIsFavorite();
  }

  extractData() {
    console.log('forecastdata in result', this.forecastData);
    this.city = this.forecastService.city;
    this.state = this.forecastService.state;

    this.seal = this.forecastData[0]['seal'];

    let weatherData = this.forecastData[0]['weather'];
    this.latitude = weatherData['latitude'];
    this.longitude = weatherData['longitude'];
    
    let currentData = weatherData['currently'];
    this.temperature = currentData['temperature'];
    this.summary = currentData['summary'];

    this.dataReady = true;

    // console.log('in result, city, state', this.city, this.state);
    this.checkIsFavorite(this.city, this.state);
    this.setActiveTab(0);
    console.warn('gotData, dataReady in result : after data extraction',this.gotData, this.dataReady);

  }

  addFavorite() {
    let id = this.favorite.getLocalDataNum();
    this.id = id + 1;
    let data = new Favorite();
    // this.favoriteData = new Favorite();
    data['id'] = this.id;
    data['seal'] = this.seal;
    data['city'] = this.city;
    data['state'] = this.state;
    data['latitude'] = this.latitude;
    data['longitude'] = this.longitude;
    
    this.favoriteData = this.favorite.addFavorites(data);
    // this.favorite.saveInLocal(this.test);
    // this.data = this.favorite.data;
    console.log('favorite added in result', this.favoriteData);
  }

  delFavorite() {
    this.favoriteData = this.favorite.deleteFavorites(this.city, this.state);
    this.id = this.id - 1;
    console.log('favorite data after delete current', this.favoriteData);
  }

  removeFavorite() {
    this.favorite.removeFavorites();
  }

  toggleStar(value) {
    this.isFavorite = value;
    console.log('isFavorite', this.isFavorite);
  }

  checkIsFavorite(city, state) {
    var favoriteIndex = this.favorite.getDuplicateIndex(city, state); 
    console.warn('favoriteIndex when got data, result', favoriteIndex);
    // var test : boolean;
    if( favoriteIndex === -1) {
      console.warn('checkIsFavorite no duplicate');
      this.isFavorite = false;
    }
    else {
      console.warn('checkIsFavorite duplicate');
      this.isFavorite = true;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setActiveTab(id: number) {
    if (this.gotData === true) {
      this.tabset.tabs[id].active = true;
    }
  }

  
}
