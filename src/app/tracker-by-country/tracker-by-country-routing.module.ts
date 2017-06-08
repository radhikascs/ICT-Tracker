import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TrackerByCountryComponent }    from './tracker-by-country.component';

const trackerByCountryRoutes: Routes = [
    { path: 'tracker-by-country/regulatory-tracker/:id', component: TrackerByCountryComponent },
    { path: 'tracker-by-country/regulatory-tracker',  redirectTo: "tracker-by-country/regulatory-tracker/2015" }
];

@NgModule({
  imports: [
    RouterModule.forChild(trackerByCountryRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class TrackerByCountryRoutingModule { }
