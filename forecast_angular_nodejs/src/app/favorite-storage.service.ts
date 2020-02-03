import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { BehaviorSubject } from 'rxjs';

import { Favorite } from './favorite-class';
import { NgIf } from '@angular/common';

const  STORAGE_KEY = 'local_favorites';
// const  STORAGE_KEY = 'test';

@Injectable({
  providedIn: 'root'
})
export class FavoriteStorageService {
  // public data: Favorite[];
  public data: any = [];
  public dataNum : number;
  
  private favoriteSubject : BehaviorSubject<any> = new BehaviorSubject<any>(this.storage.get(STORAGE_KEY));

  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService) { }

  getFavorites() {
    this.data = this.getFromLocal();
    return this.data;
  }

  addFavorites(currInput) {
    // currentData.push not working -> because previous data was not an array and I had to push the array element
    
    var localData = this.getFromLocal() || [];
    console.warn('initial local', localData);
    var noDuplicate = this.getDuplicateIndex( currInput['city'],currInput['state']);
    console.warn('noDuplicate', noDuplicate);
    console.warn('getFromLocal', localData);
    if (noDuplicate === -1) {
      localData.push(currInput);
      this.data = this.saveInLocal(localData);
      console.warn('favoriteAdded');
    }
    else {
      console.warn('favorite not added: duplicate');
    }
    this.updateFavoriteStatus(this.data);
    return this.data;
  }

  deleteFavorites(city, state) {
    var localData = this.getFromLocal();
    console.log('favorite service, delete', localData);
    var dupIndex = this.getDuplicateIndex(city, state);
    if (dupIndex != -1) {
      localData.splice(dupIndex, 1);
    }
      this.data = this.saveInLocal(localData);
      this.updateFavoriteStatus(this.data);
      return this.data;
  }

  removeFavorites() {
    this.storage.remove(STORAGE_KEY);
    console.log('removed', this.getFromLocal())
  }

  saveInLocal(currStorageList): void {
    console.log('service initial data',this.data);
    console.log('initial Local Storage', this.storage.get(STORAGE_KEY));
    this.storage.set(STORAGE_KEY, currStorageList);
    console.log('after save in local', this.storage.get(STORAGE_KEY));
    return  this.storage.get(STORAGE_KEY);
  }

  getFromLocal() {
    console.log('received from local');
    return  this.storage.get(STORAGE_KEY);
  }

  getLocalDataNum() {
    let storageData = this.storage.get(STORAGE_KEY);
    let num = 0;
    if (storageData !== null) {
      num = storageData.length;
    }
    return num;
  }

  getDuplicateIndex(city, state) {
    var localdata = this.getFromLocal();
    var noDup = -1;
    if (localdata === null) {
      return noDup;
    }

    for (let i = 0; i < localdata.length; i++) {
      if (localdata[i]['city'] === city && localdata[i]['state'] === state){
        noDup = i;
      }
      else {
        noDup = -1;
      }
    }
    return noDup;
  }

  public updateFavoriteStatus(favoriteData) {
    this.favoriteSubject.next(favoriteData);
  }

  public getFavoriteStatus(): BehaviorSubject<any> {
    return this.favoriteSubject;
  }
}
