import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FavoriteComponent } from './favorite/favorite.component';
import { ResultComponent } from './result/result.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: 'favorite', component: FavoriteComponent },
  { path: 'result', component: ResultComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
