import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrackerByCountryComponent }    from './tracker-by-country.component';

import {  TrackerByCountryRoutingModule }    from './tracker-by-country-routing.module';

import { TrackerByCountryService } from './tracker-by-country.service';

import { PeityChartDirective } from './peity-chart.directive';

import {ShareButtonsModule} from "ng2-sharebuttons";





@NgModule({
  imports: [
    CommonModule,
    TrackerByCountryRoutingModule,
    ShareButtonsModule
    
  ],
  declarations: [TrackerByCountryComponent, PeityChartDirective],
  providers:[TrackerByCountryService]
})
export class TrackerByCountryModule { }
