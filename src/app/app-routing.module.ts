import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';


//import { TrackerByCountryComponent } from './tracker-by-country/tracker-by-country.component';
//import { CountryCardComponent } from './country-card/country-card.component';
//import { TrackerByRegionComponent } from './tracker-by-region/tracker-by-region.component';
//import { ComparisonCardComponent } from './comparison-card/comparison-card.component';
import { MapComponent } from './map/map.component';
import { GenerationsRegulationComponent } from './generations-regulation/generations-regulation.component';
import { AboutTrackerComponent } from './about-tracker/about-tracker.component';




const appRoutes: Routes = [
  //{ path: 'tracker-by-country', component: TrackerByCountryComponent },
  { path: '',  redirectTo: '/tracker-by-country/regulatory-tracker/2015', pathMatch: 'full'},
  //{ path: 'country-card', component: CountryCardComponent },
  //{ path: 'tracker-by-region', component: TrackerByRegionComponent },
  //{ path: 'comparison-card', component: ComparisonCardComponent },

  //{ path: 'generations-of-regulation', component: GenerationsRegulationComponent },
  { path: 'about-tracker', component: AboutTrackerComponent }
 
 // { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: true })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}

