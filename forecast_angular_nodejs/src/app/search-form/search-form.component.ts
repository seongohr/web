import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Router, Routes, RouterModule } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { Observable, empty } from 'rxjs';

import { ForecastService } from '../forecast.service';
import { STATES } from '../state-options';
// import { ResultComponent } from '../result/result.component';
import {NgbTabsetConfig} from '@ng-bootstrap/ng-bootstrap';
import { TabsetComponent, TabDirective } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css'],
  providers: [NgbTabsetConfig]
})

export class SearchFormComponent implements OnInit {
  stateOptions = STATES;
  submitted = false;
  progressBar = false;
  gotGeoJson = false;
  geoJson : any;
  invalid_address = false;
  no_record = false;
  cityPrediction : any;
  pathname: string = '';

  // userForm : FormGroup;
   
  public street : string;
  // public city : string;
  public state : string;
  public currLoc : boolean;
  public cityModel: any;
  // public userForm : FormGroup;

  // currLocChecked = this.userForm['currLoc'];
  // gotData : any[];
  subscription: Subscription;
  private ngUnsubscribe: Subject<any> = new Subject();
  
  constructor(private router: Router, 
              private forecastService: ForecastService,
              config: NgbTabsetConfig)
  {
    config.justify = 'center';
    config.type = 'pills';
  }

  ngOnInit() {
    this.forecastService.getForecastStatus()
                        .pipe(takeUntil(this.ngUnsubscribe))
                        .subscribe(
                          data => {
                            // this.gotData = data;
                            console.log('gotData in searchForm component', data);
                            if (data === true) {
                              this.progressBar = false;
                              // this.clickButton('result');
                            }
                          });

    this.subscription = this.forecastService.getError()
                            .pipe(takeUntil(this.ngUnsubscribe))
                            .subscribe(error => {
                              if (error == 'invalid address') {
                                this.invalid_address = true;
                                this.progressBar = false;
                              }
                              else if (error == 'no records'){
                                this.no_record = true;
                                this.progressBar = false;
                              }
                              else {
                                this.invalid_address = false;
                                this.no_record = false;
                              }
                            });

    const { pathname } = window.location;
    this.pathname = pathname;

    // console.log('ngOnInit(): pathname: %s', pathname);

    this.router.events.subscribe((val) => {
      this.pathname = window.location.pathname;
    });

  }

  onSubmit() {
    console.warn('onsubmit gotData->false');
    this.sendGotDataOnSubmit();
    this.submitted = true;
    // this.router.navigateByUrl('/result');
    this.progressBar = true;
    this.invalid_address = false;
    this.no_record = false;
    // this.sendGotDataOnSubmit();

    if (this.currLoc===true) {
      this.callGeo();
    }
    else {
      this.getGoogleGeo();
    }
  }

  clearForm() {
    // this.router.navigateByUrl('/');
    // this.router.navigate(['']);
    // window.location.reload();
    // console.log('this.submitted', this.submitted);
    window.location.href = '/';
  }

  callGeo() {
    this.forecastService.getGeoLocation();
  }

  getGoogleGeo() {
    let stName = this.street;
    let cityName = this.cityModel;
    let stateName = this.state;
    // console.warn('input in form, street, city, state', this.street, this.cityModel, this.state);
    this.forecastService.getGoogleGeocode(stName, cityName, stateName);
  }

  ngOnDestroy(): any {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  sendGotDataOnSubmit() {
    this.forecastService.gotData = false;
    this.forecastService.updateForecastStatus(false);
    // this.forecastService.updateForecastStatus(false);
    console.warn('signal gotData to service on submit in search form');
  }

  search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term = '') => {
        return term.length > 0 ? this.forecastService.getAutoComplete(term)
          .pipe(
            map(res => {
              if (res.predictions) {
                const result = res.predictions.map((prediction) => {
                  return prediction.structured_formatting.main_text;
                });
                return result;
              }
              return [];
            }),
          ) : empty();
      }));
  }

  // onCheckCurrLoc(e) {
  //   var check = e.target.checked;
  //   if (!check) {
  //     this.userForm.reset();
  //   }
  // }

  clickButton = (path) => {
    this.router.navigate(
      [`/${path}` ],
      { queryParamsHandling: 'preserve' },
    );
  }
       
  // clickButton() {
  //   console.log('clicked');
  // }

}
