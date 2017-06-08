import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TrackerByRegionComponent }    from './tracker-by-region.component';

const trackerByRegionRoutes: Routes = [
    { path: 'tracker-by-region/regulatory-tracker/:id', component: TrackerByRegionComponent },
     { path: 'tracker-by-region/regulatory-tracker',  redirectTo: "tracker-by-region/regulatory-tracker/Arab States" }
];

@NgModule({
  imports: [
    RouterModule.forChild(trackerByRegionRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class TrackerByRegionRoutingModule { }
