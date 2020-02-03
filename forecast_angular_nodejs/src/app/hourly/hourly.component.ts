import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { takeUntil} from 'rxjs/operators';

// import { MOCK_DATA } from '../forecastMockData'
import { ForecastService } from '../forecast.service';
import { staticViewQueryIds } from '@angular/compiler';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';

const GraphType = {
  humidity: {
    labelString: '% Humidity',
  },
  ozone: {
    labelString: 'Dobson Units',
  },
  pressure: {
    labelString: 'Millibars',
  },
  temperature: {
    labelString: 'Fahrenheit',
  },
  visibility: {
    labelString: 'Miles per Hour',
  },
  windSpeed: {
    labelString: 'Miles per Hour',
  },
};

@Component({
  selector: 'app-hourly',
  templateUrl: './hourly.component.html',
  styleUrls: ['./hourly.component.css']
})
export class HourlyComponent implements OnInit {
  @ViewChild( 'baseChart', {static: false}) baseChart: BaseChartDirective;
  forecastData : any = null;
  chartReady = false;
  showChart = false;
  chartData = [];
  subscription: Subscription;
  options = [
    {id: 0, name:'Temperature'},
    {id: 1, name: 'Pressure'}, 
    {id: 2, name: 'Humidity'}, 
    {id: 3, name: 'Ozone'}, 
    {id: 4, name: 'Visibility'}, 
    {id: 5, name: 'Wind Speed'}];
  labels = ['temperature', 'pressure', 'humidity', 'ozone', 'visibility', 'wind speed'];
  public chartColors: Array<any> = [
    { // first color
      backgroundColor: '#93dcf3',
      borderColor: 'rgba(225,10,24,0.2)',
      pointBackgroundColor: 'rgba(225,10,24,0.2)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(225,10,24,0.2)'
    }];
    
  public barChartOptions  = {
    scaleShowVerticalLines: false,
    responsive: true,
    tooltips: {
      mode: 'nearest'
    },
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Time difference from current hour',
        },
        ticks: {
          beginAtZero: true,
        },
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: GraphType['temperature'].labelString,
        },
        ticks: {
          beginAtZero: true,
        },
      }],
    }
  }; 

  public barChartType = 'bar';
  public barChartLegend = true; 
  public barChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
  public barChartData = [];
  public yAxisId = 'temperature';
  public color = 'skyblue';

  private ngUnsubscribe: Subject<any> = new Subject();


  constructor(private forecastService: ForecastService) {
    
   }
  
  ngOnInit() {
    // this.extractData();
    this.subscription = this.forecastService.getWeatherData()
                            .pipe(takeUntil(this.ngUnsubscribe))
                            .subscribe(data => {
                              if (data) {
                                this.forecastData = data;
                                console.log('forecastData in hourly', this.forecastData);
                                this.extractData();
                              }
                              else {
                                this.forecastData = null;
                              }
                            });
  }

  ngAfterViewInit() {

  }

  extractData() {
    this.chartData = [];

    let weatherData = this.forecastData[0]['weather'];
    let hourly = weatherData['hourly']['data'];

    let tempData = [];
    let pressureData = [];
    let humidityData = [];
    let ozoneData = [];
    let visibilityData = [];
    let windData = [];

    for (let i = 0; i <24; i++) {
      let temp = hourly[i];

      tempData.push(temp['temperature']);
      humidityData.push(temp['humidity'])
      pressureData.push(temp['pressure']);
      windData.push(temp['windSpeed']);
      visibilityData.push(temp['visibility']);
      ozoneData.push(temp['ozone']);
    }
    
    this.chartData.push({data: tempData, label: this.labels[0]});
    this.chartData.push({data: pressureData, label: this.labels[1]});
    this.chartData.push({data: humidityData, label: this.labels[2]});
    this.chartData.push({data: ozoneData, label: this.labels[3]});
    this.chartData.push({data: visibilityData, label: this.labels[4]});
    this.chartData.push({data: windData, label: this.labels[5]});

    this.chartReady = true;
    this.showChart = true;
    this.setBarChartData(this.chartData[0]);
  }

  setBarChartData(data) {
    if (this.barChartData.length ===0) {
      this.barChartData.push(data);
    }
    else {
      this.barChartData[0] = data;
    }
    // console.log('current barChartData',this.chartData[0]);
  } 

  changeData(event) {
    let dataNum = event.target.value;
    // console.log('input number', dataNum);
    this.setBarChartData(this.chartData[dataNum]);
    // this.barChartOptions =  this.barChartOptions;
    // this.chartColors = this.chartColors;
    // if (this.baseChart) {
    //   this.baseChart.chart.destroy();
    //   this.baseChart.labels = this.labels;
    //   this.baseChart.datasets = this.chartData[dataNum];
    //   // this.baseChart.options = this.barChartOptions.scales.xAxes[0]
    //   this.baseChart.colors = this.chartColors;
    //   this.baseChart.chart.render();
    //}

  }

  ngOnDestroy(): any {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
