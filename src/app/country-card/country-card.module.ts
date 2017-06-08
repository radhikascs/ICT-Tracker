import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountryCardComponent }    from './country-card.component';

import { CountryCardRoutingModule }    from './country-card-routing.module';

import { CountryCardService } from './country-card.service';

import {ShareButtonsModule} from "ng2-sharebuttons";

@NgModule({
  imports: [
    CommonModule,
    CountryCardRoutingModule,
    ShareButtonsModule
  ],
  declarations: [CountryCardComponent],
  providers:[CountryCardService]

})
export class CountryCardModule { }
