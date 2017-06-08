import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GenerationsRegulationComponent }    from './generations-regulation.component';

const generationsRegulatioRoutes: Routes = [
    { path: 'generations-of-regulation', component: GenerationsRegulationComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(generationsRegulatioRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class GenerationsRegulationRoutingModule { }
