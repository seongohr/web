import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PictureService {
  degree = "https://cdn3.iconfinder.com/data/icons/virtual-notebook/16/button_shape_oval-512.png";
  
  humidity = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-16-512.png";
  pressure = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-25-512.png";
  windSpeed = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-27-512.png";
  visibility = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-30-512.png";
  cloudCover = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-28-512.png";
  ozone = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-24-512.png";

  clear_day ="https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png";
  clear_night = "https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png";
  rain = "https://cdn3.iconfinder.com/data/icons/weather-344/142/rain-512.png";
  snow = "https://cdn3.iconfinder.com/data/icons/weather-344/142/snow-512.png";
  sleet = "https://cdn3.iconfinder.com/data/icons/weather-344/142/lightning-512.png";
  wind = "https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_10-512.png";
  fog = "https://cdn3.iconfinder.com/data/icons/weather-344/142/cloudy-512.png";
  cloudy = "https://cdn3.iconfinder.com/data/icons/weather-344/142/cloud-512.png";
  partly_cloudy_day = "https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png";
  partly_cloudy_night = "https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png\">"
  
  constructor() { }

  getCurrImage(name: string) {
    return this[name];
  }
}
