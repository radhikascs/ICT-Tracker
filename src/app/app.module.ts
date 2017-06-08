import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ComparisonCardModule }     from './comparison-card/comparison-card.module';
import { CountryCardModule }     from './country-card/country-card.module';
import { MapModule }     from './map/map.module';
import { TrackerByCountryModule }     from './tracker-by-country/tracker-by-country.module';
import { TrackerByRegionModule }     from './tracker-by-region/tracker-by-region.module';
import { GenerationsRegulationModule }     from './generations-regulation/generations-regulation.module';


//import { TrackerByCountryComponent } from './tracker-by-country/tracker-by-country.component';
//import { CountryCardComponent } from './country-card/country-card.component';
//import { TrackerByRegionComponent } from './tracker-by-region/tracker-by-region.component';
//import { ComparisonCardComponent } from './comparison-card/comparison-card.component';
//import { GenerationsRegulationComponent } from './generations-regulation/generations-regulation.component';
import { AboutTrackerComponent } from './about-tracker/about-tracker.component';




@NgModule({
  declarations: [
    AppComponent,
    AboutTrackerComponent
    //GenerationsRegulationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ComparisonCardModule,
    CountryCardModule,
    MapModule,
    TrackerByCountryModule,
    TrackerByRegionModule,
    GenerationsRegulationModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
