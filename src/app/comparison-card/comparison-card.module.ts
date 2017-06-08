import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Ng2AutoCompleteModule } from 'ng2-auto-complete';

import { ComparisonCardComponent }    from './comparison-card.component';

import { ComparisonCardRoutingModule }    from './comparison-card-routing.module';

import { ComparisonCardService } from './comparison-card.service';
import { GenerationOfRegulationFormatPipe } from './generation-of-regulation-format.pipe';

import {ShareButtonsModule} from "ng2-sharebuttons";


@NgModule({
  imports: [
    CommonModule,
    ComparisonCardRoutingModule,
    FormsModule,
    Ng2AutoCompleteModule,
    ShareButtonsModule
  ],
  declarations: [ComparisonCardComponent, GenerationOfRegulationFormatPipe],
  providers:[ComparisonCardService]
})
export class ComparisonCardModule { }
