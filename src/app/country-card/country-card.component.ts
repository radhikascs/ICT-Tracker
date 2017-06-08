import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { CountryCardService } from './country-card.service';

declare var L: any;
declare var Highcharts: any;

@Component({
  selector: 'app-country-card',
  templateUrl: './country-card.component.html',
  styleUrls: ['./country-card.component.css']
})
export class CountryCardComponent implements OnInit {

  mapObj: any;
  lat: number = 4.565473550710278;
  lng: number = 17.2265625;
  zoom: number = 1;
  maxZoom: number = 10;
  minZoom: number = 0;
  geoJsonLayer: any;
  geoJsonData: any;

  countriesList: any;
  selectedCountryName: string;
  selectedCountryId: string;
  selectedCountryFlagId: string;
  countryCardData: any;
  countryCardMetaData: any;
  countryCardDisplayData = [[], [], []];              // it contain objects i.e max year data, min year data, metadata 
  private sub: any;

  shareTitle = "Share:";
  fbInner = "<img src='./assets/images/custom-facebook.svg'>";
  twitterInner = "<img src='./assets/images/custom-twitter.svg'>";
  inInner = "<img src='./assets/images/custom-linkedin.svg'>";
  linkToShare;
  location: Location;
  constructor(
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    location: Location,
    private countryCardService: CountryCardService) { this.location = location; }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.selectedCountryId = params['id'];
      this.getCountryData();
      this.getShapeFile();
      this.getCountriesList();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getShapeFile() {

    this.countryCardService
      .getShapeFile()
      .then(responseObj => {
        this.geoJsonData = responseObj;
        this.loadmap();
        this.loadlayer();
      });

  }

  getCountriesList() {
    this.countryCardService
      .getCountryList()
      .then(responseObj => {
        this.countriesList = this.countryCardService.getSortedData(responseObj.features);    // first sort the response object
      });
  }


  // country data
  getCountryData() {
    this.countryCardService
      .getCountryCardData().subscribe(
      data => {
        let yearContiner = [];
        this.countryCardData = data[0];
        this.countryCardMetaData = data[1];

        data[0].filter(e => {                                // get unique year
          if (yearContiner.indexOf(e.year) == -1) {
            yearContiner.push(e.year);
          }
        });
        yearContiner.sort(function (a, b) { return b - a });

        this.countryCardDisplayData = [[], [], []];
        this.countryCardData.filter(i => {
          if ((i.year == yearContiner[0] && i.countryISO == this.selectedCountryId) || (i.year == yearContiner[yearContiner.length - 1] && i.countryISO == this.selectedCountryId)) {
            if ((i.year == yearContiner[yearContiner.length - 1])) {
              this.countryCardDisplayData[1].push(i);
            }
            if ((i.year == yearContiner[0])) {
              this.countryCardDisplayData[0].push(i);
            }
          }
        });

        this.countryCardMetaData.filter(k => {
          if (k.countryISO == this.selectedCountryId) {
            this.countryCardDisplayData[2].push(k);
          }
        });
        this.loadSpiderChart();
      }
      );
  }

  // init the leaflet object
  loadmap() {
    if (this.mapObj != null) return false;
    this.mapObj = new L.Map('map-container', {
      center: new L.LatLng(this.lat, this.lng),
      zoom: this.zoom,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      doubleClickZoom: false
    });
  }

  // load the geojson layer on leaflet
  loadlayer() {
    
    this.geoJsonLayer = L.geoJson(this.geoJsonData, {
      style: (layer) => {

        return {
          color: '#eee',
          weight: 1,
          opacity: 1,
          fillColor: layer.properties.ISO_3_CODE == this.selectedCountryId ? '#00a3e0' : '#ffffff',
          fillOpacity: 1,
          className: ''
        };
      },
      onEachFeature: (layer: any, feature: any) => {

        feature.bindTooltip(layer.properties.CNTRY_TERR, {      // bind tooptip for on each layer (now leaflet core supported)
          direction: 'auto',
          sticky: true,
          opacity: 0.9
        });

        feature.on({
          mouseover: (e: any) => {                            // mouse over highlight style
            e.target.setStyle({
              weight: 2,
              color: 'white',
              dashArray: '',
              fillOpacity: 0.7
            });
          },
          mouseout: (e: any) => {                             // mouse out reset layer style
            this.geoJsonLayer.resetStyle(e.target);
          },
          click: () => {                                      // click on layer 
            
          }
        });
      }
    });

    this.mapObj.addLayer(this.geoJsonLayer);


    // Zoom selected country 
    this.geoJsonData.features.filter((layer) => {
      if (layer.properties.ISO_3_CODE == this.selectedCountryId) {
        var currentBounds = L.geoJson(layer).getBounds();
        this.mapObj.fitBounds(currentBounds);
        setTimeout(() => {
          let zoomDiff = this.mapObj.getZoom()
          if (this.mapObj.getZoom() > 4) {
            zoomDiff = 4;
          }
          this.mapObj.setView(this.mapObj.getCenter(), zoomDiff);

        }, 800);
      }
    });
  }

  resetStyle(e: any) {
    this.geoJsonLayer(e.target);
  }

  removeGeoLayer = function () {
    if (this.geoJsonLayer != undefined) {

      this.mapObj.removeLayer(this.geoJsonLayer);
    }
  }

  // chart 

  loadSpiderChart() {
   
    Highcharts.chart('spider-chart-container', {
      chart: {
        polar: true,
        type: 'line',
        spacingLeft: 10,
        marginRight: 100
      },
      credits: {
        enabled: false
      },
      exporting: {
         enabled: false
      },
      title: {
        text: '',//this.selectedCountryName,
        x: 0,
        y: 3
      },
      pane: {
        size: '80%'
      },
      xAxis: {
        categories: ['Regulatory authority', 'Regulatory mandate', 'Regulatory regime', 'Competition framework'],
        tickmarkPlacement: 'on',
        lineWidth: 2,
        labels: {
         // distance: 15,
          step: 1,
          style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif',
                    width: 150,

                }
        }
      },
      tooltip: {
            shared: true,
            crosshairs: true
      },
      yAxis: {
        //gridLineInterpolation: 'polygon',
        lineWidth: 2,
        "tickInterval": 1,
        "min": 0,
        "max": 30,
        endOnTick: true,
        showLastLabel: false       
      },
      legend: {
        align: 'left',
        verticalAlign: 'top',
        y: 3,
        layout: 'vertical'
      },

      plotOptions: {
        /* 			line: {
                marker: {
                  enabled: true
                }
              } */
        series: {
          states: {
            hover: {
              enabled: true,
              halo: {
                size: 0
              }
            }
          }
        }
      },
      series: [{
        name: '2007',
      data: [Number(this.countryCardDisplayData[1][0].cluster1RA), Number(this.countryCardDisplayData[1][0].cluster2RM), Number(this.countryCardDisplayData[1][0].cluster3RR), Number(this.countryCardDisplayData[1][0].cluster4CF)],
        pointPlacement: 'on',
        color: '#318dde',
        marker: {
          symbol: 'circle',
          fillColor: '#318dde',
          lineWidth: 1,
          lineColor: null // inherit from series
        }
      }, {
        name: '2015',
        data: [Number(this.countryCardDisplayData[0][0].cluster1RA), Number(this.countryCardDisplayData[0][0].cluster2RM), Number(this.countryCardDisplayData[0][0].cluster3RR), Number(this.countryCardDisplayData[0][0].cluster4CF)],
        pointPlacement: 'on',
        color: '#b33226',
        marker: {
          symbol: 'circle',
          fillColor: '#b33226',
          lineWidth: 2,
          lineColor: null // inherit from series
        }
      }]
    });

  }

  // to set by country in dropdown
  isSelected(country: any) {
    if (country.properties.iso_a3 == this.selectedCountryId) {
      this.selectedCountryName = country.properties.name;
      this.selectedCountryFlagId = country.properties.iso_a2.toLowerCase();
      return true;
    }
  }

  // change the country for country card event hadler
  onSelect(selection: any) {

    this.selectedCountryName = selection.properties.name;
    this.selectedCountryId = selection.properties.iso_a3;
    this.selectedCountryFlagId = selection.properties.iso_a2.toLowerCase();
    this.router.navigate(['/country-card', selection.properties.iso_a3]);
  }

 prepareFormatForDownloadData() {

   return [
     {" ":"Country Name", "_": this.countryCardDisplayData[0][0].countryName},
     {" ":"Mobile-cellular telephone subscriptions per 100 inhabitants, 2015", "_": this.countryCardDisplayData[2][0].mc_subs},
     {" ":"Fixed broadband subscriptions per 100 inhabitants, 2015", "_": this.countryCardDisplayData[2][0].fb_subs},
     {" ":"GNI per capita (in USD)", "_": this.countryCardDisplayData[2][0].gni},
     {" ":"Region", "_": this.countryCardDisplayData[0][0].regionName},
     {" ":"Tracker 2015 Rank", "_": this.countryCardDisplayData[0][0].rank},
     {" ":"Tracker 2015 Score", "_": this.countryCardDisplayData[0][0].overall},
     {" ":"Tracker 2007 Rank", "_": this.countryCardDisplayData[1][0].rank},
     {" ":"Tracker 2007 Score", "_": this.countryCardDisplayData[0][0].overall},
     {" ":"Cluster 1: REGULATORY AUTHORITY (Max Category Score: 20)", "_": this.countryCardDisplayData[0][0].cluster1RA},
     {" ":"Cluster 2: REGULATORY MANDATE (Max Category Score: 22)", "_": this.countryCardDisplayData[0][0].cluster2RM},
     {" ":"Cluster 3: REGULATORY REGIME (Max Category Score: 30)", "_": this.countryCardDisplayData[0][0].cluster3RR},
     {" ":"Cluster 4: COMPETITION FRAMEWORK (Max Category Score: 28)", "_": this.countryCardDisplayData[0][0].cluster4CF}
  ];
 }

  // download data in csv format
  download() {
    let csvData = this.ConvertToCSV(this.prepareFormatForDownloadData(),"Country Card - " + this.selectedCountryName, true);
    let a = document.createElement("a");
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    let blob = new Blob([csvData], { type: 'text/csv' });
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = this.selectedCountryName + "_Country_Card" + ".csv";
    a.click();
  }


  ConvertToCSV(JSONData, ReportTitle, ShowLabel ) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    let arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    let CSV = '';    
    //Set Report title in first row or line
    
    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        let row = "";
        
        //This loop will extract the label from 1st index of on array
        for (let index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (let i = 0; i < arrData.length; i++) {
        let row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }

    return CSV;
  }


   // print page 
   print(): void {
     let docprint = window.open("about:blank", "_blank"); 
     let oTable = document.getElementById("print-section");
     docprint.document.open();
     docprint.document.write('<html><head><title>Country Card</title>'); 
     docprint.document.write( "<link rel=\"stylesheet\" href=\"./assets/print/bootstrap.min.css\" type=\"text/css\"/>" );
     docprint.document.write( "<link rel=\"stylesheet\" href=\"./assets/print/country-card-print.css\" type=\"text/css\" media=\"print\"/>" );
    // docprint.document.write( "<link rel=\"stylesheet\" href=\"./assets/print/flag-icon-css/css/flag-icon.min.css\" type=\"text/css\" media=\"all\"/>" );
    // docprint.document.write( "<link rel=\"stylesheet\" href=\"styles.bundle.css\" type=\"text/css\" media=\"print\"/>" );
     docprint.document.write('</head><body><center>');
     docprint.document.write(`
      <div class="text-left">
        <h3>  ` + this.selectedCountryName + ` </h3>
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
        },1200);
	 } 
     
  }
}
