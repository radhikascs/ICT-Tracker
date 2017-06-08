import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';

import { MapComponent }    from './map.component';


import { MapRoutingModule }    from './map-routing.module';

import { MapService } from './map.service';
import { HighlightDirective } from './highlight.directive';

import {ShareButtonsModule} from "ng2-sharebuttons";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MapRoutingModule,
    ShareButtonsModule
  ],
  declarations: [
   MapComponent,
   HighlightDirective
  ],
  providers: [ MapService]
})
export class MapModule {}
