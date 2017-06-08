import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ComparisonCardComponent }    from './comparison-card.component';

const comparisonCardRoutes: Routes = [
    { path: 'comparison-card', component: ComparisonCardComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(comparisonCardRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ComparisonCardRoutingModule { }
