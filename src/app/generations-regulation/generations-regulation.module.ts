import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenerationsRegulationComponent }    from './generations-regulation.component';

import { GenerationsRegulationRoutingModule }    from './generations-regulation-routing.module';

import { GenerationsRegulationService } from './generations-regulation.service';

import {ShareButtonsModule} from "ng2-sharebuttons";

@NgModule({
  imports: [
    CommonModule,
    GenerationsRegulationRoutingModule,
    ShareButtonsModule
  ],
  declarations: [GenerationsRegulationComponent],
   providers:[GenerationsRegulationService]
})
export class GenerationsRegulationModule { }
