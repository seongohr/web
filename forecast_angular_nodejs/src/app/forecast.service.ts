import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Observable, Subject } from 'rxjs'; 

import { States } from './states-class';
import { STATES } from './state-options';
import { keyframes } from '@angular/animations';
import { MOCK_DATA } from './forecastMockData';

// const serverAddress='http://localhost:5000';
const serverAddress='';

@Injectable({
  providedIn: 'root'
})
export class ForecastService {
  userLocation : string;
  gotGeoJson = false;
  gotData = false;
  forecastData = [{seal: '', weather: null, success: false}];
  city : string;
  state : string;
  seal : string;
  dailyData = [{weather: null, success: false}];

  private forecast : BehaviorSubject<any> = new BehaviorSubject<any>(this.gotData);
  private weatherData : Subject<any> = new Subject<any>();
  private errorStatus : Subject<any> = new Subject<any>();

  constructor(private http: HttpClient) {
    // this.address$ = this.addressSubject.asObservable();
  }

  public getStates(): States[] {
    return STATES;
  }

  getGeoLocation() {
    const url = "http://ip-api.com/json";
    this.http.get(url)
        .subscribe(data => {
          this.city = data["city"];
          this.userLocation = data["lat"]+','+data["lon"];
          this.gotGeoJson = true;
          this.state = data['region'];
          let stateName = data['regionName'];
          // console.warn('service getGeo-userLocation[lat,lon]', this.userLocation);
          this.getCustomSeal(stateName);
          // this.getForecastResult(this.userLocation, this.forecastData);
        });
  }

  getGoogleGeocode(street: string, city: string, state: string) {
    // console.log('received address', street, city, state);
    this.city = city;
    this.state = state;
    // console.log('this.city in forecast service', this.city);
    var address = street+','+city+','+state;
    var url = serverAddress + '/googleLocation?address='+ address;

    // get weather data
    this.http.get(url)
        .subscribe(res => {
          // console.log('raw data', res);

          if (res['status'] === 'OK'){
            var lat = res["results"][0]["geometry"]["location"]["lat"];
            var lng = res["results"][0]["geometry"]["location"]["lng"];
            this.userLocation = lat+','+lng;
            // console.log('GeoCode-done',this.userLocation);
            //get seal
            this.getCustomSeal(this.getStateName(state));
            // this.getForecastResult(this.userLocation, this.forecastData);
          }
          else {
            this.sendError('invalid address');
          }
        });
  }

  getCustomSeal(state) {
    var customUrl = serverAddress + '/customLocation?state=' + state;

    this.http.get(customUrl)
        .subscribe(res => {
          var sealInfo = res['items'][0]['link'];
          console.log('sealInfo in service', sealInfo);
          this.forecastData[0]['seal']= sealInfo;
          this.getForecastResult(this.userLocation, this.forecastData);
        });
  }

  getForecastResult(userLocation: string, forecastData) {
    // console.warn('received location', userLocation);
    var url = serverAddress + '/darkLocation?location='+ userLocation;
    // console.warn('darksky',url);
    this.http.get(url)
      .subscribe(res => {
        // console.log('darkskayJson', res)
        if (res['latitude']) {
          this.gotData = true;
          this.updateForecastStatus(this.gotData);
          // console.warn('received from favorite forecastData',forecastData);
          forecastData[0]['weather'] = res;
          forecastData[0]['success'] = true;
          console.log('forecastData updated in service', forecastData);
          this.sendWeatherData(forecastData);
          this.forecastData = forecastData;
        }
        else {
          this.sendError('no records');
        }
        
      });
  }

  public getForecastStatus(): BehaviorSubject<any> {
    console.warn('service: send', this.forecast);
    return this.forecast;
  }

  updateForecastStatus(status) {
    console.warn('service: update', this.forecast);
    this.forecast.next(status);
  }

  //for components
  public getForecastData() {
    return this.forecastData;
  }

  sendWeatherData(message: any) {
    this.weatherData.next(message);
  }

  clearWeatherData() {
    this.weatherData.next();
    this.weatherData.complete();
  }

  sendError(message: any) {
    this.errorStatus.next(message);
  }

  clearError() {
    this.errorStatus.next();
    this.errorStatus.complete();
  }

  getDailyForecast(address) : Observable<any> {
    console.warn('called daily in service');
    var url = serverAddress + '/darkDailyLocation?address=' + address;

    return this.http.get(url);
  }

  getAutoComplete(city) : Observable<any> {
    // console.warn('called autocomplete in service');
    var url = serverAddress + '/cityLocation?city=' + city;

    return this.http.get(url);
  }

  //for components' use
  getCity() {
    return this.city;
  }

  getWeatherData(): Observable<any> {
    return this.weatherData.asObservable();
  }

  getError(): Observable<any> {
    return this.errorStatus.asObservable();
  }

  getStateName(idx) {
    let tempState;
    
    for (let i = 0; i < STATES.length; i++) {
      if (idx === STATES[i]['id']) {
        tempState = STATES[i]['name'];
      }
    }
    // console.log('state in forecast service', tempState);
    return tempState;
  }
}
