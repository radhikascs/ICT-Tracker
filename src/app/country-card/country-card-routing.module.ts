import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CountryCardComponent }    from './country-card.component';

const countryCardRoutes: Routes = [
    { path: 'country-card/:id', component: CountryCardComponent },
     { path: 'country-card',  redirectTo:'country-card/AFG' },
];

@NgModule({
  imports: [
    RouterModule.forChild(countryCardRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class CountryCardRoutingModule { }
