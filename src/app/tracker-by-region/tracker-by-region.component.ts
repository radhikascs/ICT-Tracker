import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/switchMap';


import { TrackerByRegion } from './tracker-by-region';
import { TrackerByRegionService } from './tracker-by-region.service';

declare var jQuery: any;

@Component({
  selector: 'app-tracker-by-region',
  templateUrl: './tracker-by-region.component.html',
  styleUrls: ['./tracker-by-region.component.css']
})
export class TrackerByRegionComponent implements OnInit {

  dropDownItemsContainer = [
    { "name": "Arab States", mapped: ["2"] },
    { "name": "CIS", mapped: ["3"] },
    { "name": "East Asia & Pacific", mapped: ["4"] },
    { "name": "Europe", mapped: ["5"] },
    { "name": "Latin America & the Caribbean", mapped: ["6"] },
    { "name": "North America", mapped: ["7"] },
    { "name": "South Asia", mapped: ["8"] },
    { "name": "Sub-Saharan Africa", mapped: [] },
    { "name": "Americas ( North America + Latin America & the Caribbean )", mapped: ["7", "6"] },
    { "name": "Asia ( East Asia & Pacific + South Asia )", mapped: ["4", "8"] }
  ];
  trackerByRegionData: TrackerByRegion[];
  currentSelectedItem: string;
  latestYear: string;
  private sub: any;

  shareTitle = "Share:";
  fbInner = "<img src='./assets/images/custom-facebook.svg'>";
  twitterInner = "<img src='./assets/images/custom-twitter.svg'>";
  inInner = "<img src='./assets/images/custom-linkedin.svg'>";

  constructor(
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private trackerByRegionService: TrackerByRegionService) { }

  ngOnInit() {
    
    this.sub = this.route.params.subscribe(params => {
      this.currentSelectedItem = params['id'];
      this.getTrackerByCountryRegion();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  displayGraphics() {
    //jQuery(this.elementRef.nativeElement).find('.donut').peity('donut');
  }

  getTrackerByCountryRegion(): void {

    this.trackerByRegionService
      .getTrackerByRegionData().
      then(responseObj => {

        let selectedRegion = this.currentSelectedItem;
        let mappedRegions = this.dropDownItemsContainer.filter((r) => {
          if (r.name == selectedRegion) return r;
        });

        let tempYearCont: any = [];
        responseObj.filter(obj => {
          if (tempYearCont.indexOf(obj.year) === -1) {
            tempYearCont.push(obj.year);
          }
        });

        tempYearCont.sort(function (a, b) { return b - a });
        this.latestYear = tempYearCont[0];

        this.trackerByRegionData = responseObj.filter(obj => {
          if (mappedRegions[0].mapped.indexOf(obj.regionId) != -1 && obj.year == this.latestYear) {
            return obj;
          }
        });
        this.trackerByRegionData = this.trackerByRegionService.getSortedData(this.trackerByRegionData, 'countryName');
      });

  }

  onSelect(onClickselectedItem: any) {
    this.currentSelectedItem = onClickselectedItem.name;
    this.router.navigate(['/tracker-by-region/regulatory-tracker', this.currentSelectedItem]);
  }


  // download data in csv format
  download() {
    var csvData = this.ConvertToCSV(this.trackerByRegionData);
    var a = document.createElement("a");
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    var blob = new Blob([csvData], { type: 'text/csv' });
    var url = window.URL.createObjectURL(blob);
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
    docprint.document.write('<html><head><title>Tracker By Region</title>');
    // docprint.document.write( "<link rel=\"stylesheet\" href=\"styles.bundle.css\" type=\"text/css\" media=\"print\"/>" );
    docprint.document.write("<link rel=\"stylesheet\" href=\"./assets/print/tracker-by-region-print.css\" type=\"text/css\" media=\"print\"/>");
    docprint.document.write('</head><body><center>');
    docprint.document.write(`
      <div class="">
          <h4>Regulatory Tracker ` + this.currentSelectedItem + `</h4>
      </div>
     `);
    docprint.document.write(oTable.innerHTML);
    docprint.document.write('</center></body></html>');
    docprint.document.close();
    docprint.onload = function () {
      docprint.focus();
      setTimeout(() => {
        docprint.print();
        docprint.close();
      }, 700);
    }

  }
}
