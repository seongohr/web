import { Component, OnInit } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { takeUntil} from 'rxjs/operators';

import { ForecastService } from '../forecast.service';
// import { MOCK_DATA } from '../forecastMockData'

@Component({
  selector: 'app-current',
  templateUrl: './current.component.html',
  styleUrls: ['./current.component.css']
})
export class CurrentComponent implements OnInit {
  gotData : any;
  forecastData: any;
  city : string;
  // city = this.forecastService.getCity();
  timezone : string;
  currentData : any;
  temperature : number;
  summary : string;
  humidity : number;
  pressure : number;
  windSpeed : number;
  cloudCover : number;
  visibility : number;
  ozone : number;
  state : string;
  seal : string = '';

  subscription: Subscription;
  private ngUnsubscribe: Subject<any> = new Subject();


  degree = "https://cdn3.iconfinder.com/data/icons/virtual-notebook/16/button_shape_oval-512.png";
  humidityImage = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-16-512.png";
  pressureImage = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-25-512.png";
  windSpeedImage = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-27-512.png";
  visibilityImage = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-30-512.png";
  cloudCoverImage = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-28-512.png";
  ozoneImage = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-24-512.png";

  constructor(private forecastService: ForecastService) {
    this.subscription = this.forecastService.getWeatherData()
                            .pipe(takeUntil(this.ngUnsubscribe))
                            .subscribe(data => {
                              if (data) {
                                this.forecastData = data;
                                this.extractData();
                                // this.printLog();
                              }
                              else {
                                this.forecastData = null;
                              }
                              console.warn('current forecastData',this.forecastData);
                            });
   }

  ngOnInit() {

  }

  printLog() {
    console.log('forecastData in current', this.forecastData);
    console.log('city in current', this.city);
  }

  extractData() {
    this.city = this.forecastService.city;
    this.state = this.forecastService.state;
    console.log('current city, state', this.city, this.state);

    this.seal = this.forecastData[0]['seal'];
    console.log('seal info in current', this.seal);
    let weatherData = this.forecastData[0]['weather'];

    this.timezone = weatherData['timezone'];
    this.currentData = weatherData['currently'];
    this.temperature = this.currentData['temperature'].toFixed();
    this.summary = this.currentData['summary'];


    this.humidity = this.currentData['humidity'].toFixed(2);
    this.pressure = this.currentData['pressure'].toFixed(2);
    this.windSpeed = this.currentData['windSpeed'].toFixed(2);
    this.cloudCover = this.currentData['cloudCover'].toFixed(3);
    this.visibility = this.currentData['visibility'].toFixed(2);
    this.ozone = this.currentData['ozone'].toFixed(2);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}
