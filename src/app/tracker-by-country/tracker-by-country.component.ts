import { Component, OnInit, ElementRef  } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/switchMap';


import { TrackerByCountry } from './tracker-by-country';
import { TrackerByCountryService } from './tracker-by-country.service';

declare var jQuery:any;


@Component({
  selector: 'app-tracker-by-country',
  templateUrl: './tracker-by-country.component.html',
  styleUrls: ['./tracker-by-country.component.css']
})
export class TrackerByCountryComponent implements OnInit {

shareTitle = "Share:";
fbInner = "<img src='./assets/images/custom-facebook.svg'>";
twitterInner = "<img src='./assets/images/custom-twitter.svg'>";
inInner = "<img src='./assets/images/custom-linkedin.svg'>";

  dropDownItemsContainer = [];                           
  trackerByCountryData:TrackerByCountry[];
  currentSelectedItem: string;
  private sub: any;

  constructor(
      private elementRef: ElementRef, 
      private route: ActivatedRoute,
      private router: Router,
      private trackerByCountryService:TrackerByCountryService) { }

  ngOnInit() {
     this.sub = this.route.params.subscribe(params => {
       this.currentSelectedItem = params['id']; 
        this.getTrackerByCountryData();
    }); 
  }
 
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  displayGraphics() {
    jQuery(this.elementRef.nativeElement).find('.donut').peity('donut');
  
  }

  getTrackerByCountryData(): void {
 
      this.trackerByCountryService
        .getTrackerByCountryData().
       then(responseObj => {
          let selectedYear = this.currentSelectedItem;
           responseObj.filter(obj => {        // collect all years
            if(this.dropDownItemsContainer.indexOf(obj.year) === -1 ) {
               this.dropDownItemsContainer.push(obj.year);
            }
          });
          this.dropDownItemsContainer.sort(function(a, b){return b-a});
          this.trackerByCountryData = responseObj.filter(obj => obj.year == selectedYear);
          this.trackerByCountryData = this.trackerByCountryService.getSortedData(this.trackerByCountryData , 'countryName');
          //console.log(this.trackerByCountryData);
       });
     
    }
    
    onSelect(onClickselectedItem:any) {
      this.currentSelectedItem = onClickselectedItem;
      this.router.navigate(['/tracker-by-country/regulatory-tracker', this.currentSelectedItem]);
    }


    // download data in csv format

    download(){
      var csvData = this.ConvertToCSV( this.trackerByCountryData);
      var a = document.createElement("a");
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      var blob = new Blob([csvData], { type: 'text/csv' });
      var url= window.URL.createObjectURL(blob);
      a.href = url;
      a.download = this.currentSelectedItem + "_Regulatory_tracker_" + ".csv";
      a.click();
  }

  // convert Json to CSV data in Angular2
    ConvertToCSV(objArray) {
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            var str = '';
            var row = "";
 
            for (var index in objArray[0]) {
                //Now convert each value to string and comma-separated
                row += index + ',';
            }
            row = row.slice(0, -1);
            //append Label row with line break
            str += row + '\r\n';
 
            for (var i = 0; i < array.length; i++) {
                var line = '';
                for (var index in array[i]) {
                    if (line != '') line += ','
 
                    line += array[i][index];
                }
                str += line + '\r\n';
          }
            return str;
   }

   // print page 
   print(): void {
     var docprint = window.open("about:blank", "_blank"); 
     var oTable = document.getElementById("print-section");
     docprint.document.open();
     docprint.document.write('<html><head><title>Tracker By Country</title>'); 
    // docprint.document.write( "<link rel=\"stylesheet\" href=\"styles.bundle.css\" type=\"text/css\" media=\"print\"/>" );
     docprint.document.write( "<link rel=\"stylesheet\" href=\"./assets/print/tracker-by-country-print.css\" type=\"text/css\" media=\"print\"/>" );
     docprint.document.write('</head><body><center>');
     docprint.document.write(`
      <div class="">
          <h4>Regulatory Tracker ` + this.currentSelectedItem + `</h4>
      </div>
     `);
     docprint.document.write(oTable.innerHTML);
     docprint.document.write('</center></body></html>');
     docprint.document.close();
     docprint.onload=function(){
		  docprint.focus();
        setTimeout( () => {
            docprint.print();
            docprint.close();
        },700);
	 } 
     
  }
}
