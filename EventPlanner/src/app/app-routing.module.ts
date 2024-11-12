import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WinesComponent } from './wine/wines/wines.component';
import { AddWineComponent } from './wine/add-wine/add-wine.component';
import { HomeComponent } from './layout/home/home.component';

const routes: Routes = [
  {path: 'wine', component: WinesComponent},
  {path: 'add', component: AddWineComponent},
  {path: 'home', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
