import { Component, OnInit, TemplateRef, Input, ViewChild } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


import * as CanvasJS from '../../assets/canvasjs.min';
// import { MOCK_DATA } from '../forecastMockData';
import { ForecastService } from '../forecast.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

const images = {
  'clear-day': 'https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png',
  'clear-night': 'https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png',
  'rain': 'https://cdn3.iconfinder.com/data/icons/weather-344/142/rain-512.png',
  'snow': 'https://cdn3.iconfinder.com/data/icons/weather-344/142/snow-512.png',
  'sleet': 'https://cdn3.iconfinder.com/data/icons/weather-344/142/lightning-512.png',
  'wind': 'https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_10-512.png',
  'fog': 'https://cdn3.iconfinder.com/data/icons/weather-344/142/cloudy-512.png',
  'cloudy': 'https://cdn3.iconfinder.com/data/icons/weather-344/142/cloudy-512.png',
  'partly-cloudy-day': 'https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png',
  'partly-cloudy-night': 'https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png',
};


@Component({
  selector: 'app-weekly',
  templateUrl: './weekly.component.html',
  styleUrls: ['./weekly.component.css']
})
export class WeeklyComponent implements OnInit {
  // forecastData = MOCK_DATA;
  lat : number;
  lng : number;
  chartReady = false;
  forecastData : any = null;
  subscription: Subscription;
  chartData = [];
  dailyForecast : any = null;
  @ViewChild('triggerModal', {static: false}) myExampleModal;
  
  private ngUnsubscribe: Subject<any> = new Subject();
  
  constructor(private forecastService: ForecastService, private modalService: NgbModal) {
    
   }

  ngOnInit() {
    // this.extractData(this.forecastData);
    this.subscription = this.forecastService.getWeatherData()
                            .pipe(takeUntil(this.ngUnsubscribe))
                            .subscribe(data => {
                              if (data) {
                                this.forecastData = data;
                                console.log('forecastData in weekly', this.forecastData);
                                this.extractData(this.forecastData);
                              }
                              else {
                                this.forecastData = null;
                              }
                            });
                            
    // this.getDailyWeather('51.507351,-0.127758,1574377123');
  }

  extractData(data) {
    this.chartData = [];
    let weatherData = data[0]['weather'];

    this.lat = weatherData['latitude'];
    this.lng = weatherData['longitude'];

    let dailyData = weatherData['daily']['data'];
    let num = dailyData.length;

    for (let i=0; i< num; i++) {
      const tempLow = +dailyData[i]['temperatureLow'].toFixed();
      const tempHigh = +dailyData[i]['temperatureHigh'].toFixed();
      const time = dailyData[i]['time'];
      const date = new Date(time * 1000);
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      
      this.chartData.push({x:7-i, y:[tempLow, tempHigh], label:formattedDate})
    }
    console.log('chartData in weekly', this.chartData);
    console.log('chart ready in weekly');
    this.chartReady = true;
    this.makeChart();
  }

  makeChart() {
    let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      title: {
        text: "Weekly Weather"
      },
      axisX: {
        title: "Days"
      },
      axisY: {
        includeZero: false,
        title: "Temperature in Fahrenheit",
        interval: 10,
        gridThickness: 0
      },
      dataPointMaxWidth: 15, 
      data: [{
        color: 'skyblue',
        type: "rangeBar",
        showInLegend: true,
        indexLabel: "{y[#index]}",
        legendText: "Day wise temperature range",
        click: onClick.bind(this),
        toolTipContent: "<b>{label}</b>: {y[0]} to {y[1]}",
        dataPoints: this.chartData
      }],
      legend: {
        verticalAlign: 'top',
      },
    });

    chart.render();
    
    function onClick(e) {
      console.log('click Modal');
      this.myExampleModal.nativeElement.click();
    }
    
  }

  ngOnDestroy(): any {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getDailyWeather(address: string) {
    console.warn('called daily in weekly');
    this.forecastService.getDailyForecast(address)
    .subscribe(data => {
      this.dailyForecast = data
      console.log('getDailyWeather', this.dailyForecast);
      this.extractDailyData(this.dailyForecast);
    });
  }

  extractDailyData(dailyData) {
    var data = dailyData.data[0];
    const date = new Date(data.time * 1000);
    const dailyDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    var daily = dailyData.daily;
    var currently = dailyData.currently;

    let city = this.forecastService.city;
    let temperature = currently.temperature;
    let summary = currently.s;
    let icon = images[dailyData.icon];
    let precipitation = Math.round(currently.precipIntensity * 100) / 100;
    let chanceOfRain = `${currently.precipProbability * 100} %`;
    let windSpeed = `${Math.round(currently.windSpeed * 100) / 100} mph`;
    let humidity = `${currently.humidity * 100} %`;
    let visibility = `${currently.visibility} miles`;
  }

}
