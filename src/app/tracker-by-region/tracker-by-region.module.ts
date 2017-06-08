import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { TrackerByRegionComponent }    from './tracker-by-region.component';

import {  TrackerByRegionRoutingModule }    from './tracker-by-region-routing.module';

import { TrackerByRegionService } from './tracker-by-region.service';
import { PeityChartDirective } from './peity-chart.directive';

import {ShareButtonsModule} from "ng2-sharebuttons";


@NgModule({
  imports: [
    CommonModule,
    TrackerByRegionRoutingModule,
    ShareButtonsModule
  ],
  declarations: [TrackerByRegionComponent, PeityChartDirective],
   providers:[TrackerByRegionService]
})
export class TrackerByRegionModule { }
