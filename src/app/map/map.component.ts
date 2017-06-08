import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Map } from './map';

import { MapService } from './map.service';

import { HighlightDirective } from './highlight.directive';

declare var jQuery: any;
declare var L: any;
declare var canvg: any;
declare var html2canvas: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  //template:`<div id="map-container"></div>`,
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @ViewChild(HighlightDirective) highlightDirective: HighlightDirective;

  mapObj: any;
  lat: number = 4.565473550710278;
  lng: number = 17.2265625;
  zoom: number = 2;
  maxZoom: number = 10;
  minZoom: number = 0;
  geoJsonLayer: any;
  geoJsonData: any;
  selectedOptionValue: string;
  selectedOptionName: string;
  selectionOptionMapping: any = {
    "generation-of-regulations": "Generation of Regulations",
    "most-dynamic-countries-by-rank": "Most dynamic countries (by rank change between the year 2007 and 2015)",
    "most-dynamic-countries-by-score": "Most dynamic countries (by value change between the year 2007 and 2015)"
  };


  dataHolder: any;
  selectedDataHolder: any;
  selectedDataHolderTemp: any;
  selectedYear: any;

  yearSlider: any = {
    container: ["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"],
    minYear: "2007",
    maxYear: "2015"
  };
  playInterval;

  displayAttrObj: any = {
    'baseClrKey': '',
    'label': [],               //{ name:'', key:'', 'val':''}
    legend: {
      'title': '',
      'dataType': '',
      'scaleRange': [],
      'scaleColor': [],
      'scaleLabel': [],
      'activeLegendScale': ''
    }
  };

  shareTitle = "Share:";
  fbInner = "<img src='./assets/images/custom-facebook.svg'>";
  twitterInner = "<img src='./assets/images/custom-twitter.svg'>";
  inInner = "<img src='./assets/images/custom-linkedin.svg'>";
  linkToShare;
  private sub: any;

  constructor(
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private mapService: MapService) {

  }


  ngOnInit() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        let selectedIndicatorId = params['ind'];
        let selectedYear = params['year'];
        if (selectedYear.split('-').length > 1) {
          selectedYear = selectedYear.split('-')[1];

        }
        this.selectedYear = selectedYear;
        if (!this.geoJsonData) {
          this.getShapeFile(selectedIndicatorId, selectedYear);
        } else {
          this.switchIndicator(selectedIndicatorId, selectedYear);
        }

      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  // get shape file 
  getShapeFile(selectedIndicatorId, selectedYear) {
    this.mapService
      .getShapeFile()
      .then(responseObj => {
        this.geoJsonData = responseObj;
        this.loadmap();
        this.switchIndicator(selectedIndicatorId, selectedYear);
      });
  }


  //**********************Map functionality**********************//


  // init the leaflet object
  loadmap() {
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
        let val = this.getCountryValue(this.selectedDataHolder, this.selectedYear, layer.properties.ISO_3_CODE)[0] || null;
        let fillClr = val ? this.getFeatureFillClr(val[this.displayAttrObj.baseClrKey]) : '#eee';
        return {
          color: '#FFFFFF',
          weight: 1,
          opacity: 1,
          fillColor: fillClr,
          fillOpacity: 1,
          className: ''
        };
      },
      onEachFeature: (layer: any, feature: any) => {
        // console.log(layer.properties.ISO_3_CODE);
        //console.log(this.getSelectedYearCountryData(this.dataHolder, 2015, layer.properties.ISO_3_CODE));
        //layer.properties.CNTRY_TERR
        //console.log(layer.properties.ISO_2_CODE);
        feature.bindTooltip(this.getlabelContent(layer.properties.ISO_3_CODE, layer.properties.ISO_2_CODE), {      // bind tooptip for on each layer (now leaflet core supported)
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

            this.displayAttrObj.legend.activeLegendScale = this.getLayerStyle(e.target).fillColor;
          },
          mouseout: (e: any) => {                             // mouse out reset layer style
            this.displayAttrObj.legend.activeLegendScale = '';
            this.geoJsonLayer.resetStyle(e.target);
          },
          click: () => {                                      // click on layer 
          }
        });
      }
    });

    this.mapObj.addLayer(this.geoJsonLayer);
  }

  getLayerStyle = function (layer) {
    var layerStyleObj = { className: '', fillColor: '' };
    if (layer.options != undefined) {
      layerStyleObj.className = layer.options.className;
      layerStyleObj.fillColor = layer.options.fillColor;
    } else {
      var getLeafletId = layer._leaflet_id;
      var ftrlayer = layer._layers;
      layerStyleObj.className = ftrlayer[getLeafletId - 1].options.className;
      layerStyleObj.fillColor = ftrlayer[getLeafletId - 1].options.fillColor;
    }
    return layerStyleObj;
  }

  // label content template
  getlabelContent(id, countryFlagId) {

    let countryData = this.getCountryValue(this.selectedDataHolder, this.selectedYear, id);

    let confLabel = this.displayAttrObj.label;
    //console.log(countryData);
    //console.log(confLabel);
    if (countryData.length == 0) return '----';

    if (this.selectedOptionValue == "most-dynamic-countries-by-rank" || this.selectedOptionValue == "most-dynamic-countries-by-score") {

      let labelTemplate = `<div id="tooltip-wrapper">
                            <div>
                            <ul class="list-inline">
                              <li><span class="f32"><span class="flag ` + countryFlagId.toLowerCase() + `"></span></span></li>
                              <li><span class="f32"><strong>`+ countryData[0].countryName + `</strong></span></li>
                            </ul>
                            </div>
                            
                            <div class="table-responsive">
                              <table class="table">
                                <tr>
                                  <td class="active">Year</td>
                                  <td class="success">` + countryData[0].endYear + `</td>
                                  <td class="info">` + countryData[0].startYear + `</td>
                                </tr>
                                <tr>
                                  <td class="active">Overall Score</td>
                                  <td class="success">` + countryData[0].endYearValue + `</td>
                                  <td class="info">` + countryData[0].startYearValue + `</td>
                                </tr>
                                <tr>
                                  <td class="active">Rank</td>
                                  <td class="success">` + countryData[0].endYearRank + `</td>
                                  <td class="info">` + + countryData[0].startYearRank + `</td>
                                </tr>
                              </table>
                            </div>
                          </div>`;
      return labelTemplate;

    } else {
      let overallVal = Number(countryData[0].overall).toFixed(2);
      let labelTemplate = `<div id="tooltip-wrapper">
                          <div>
                          <ul class="list-inline">
                            <li><span class="f32"><span class="flag ` + countryFlagId.toLowerCase() + `"></span></span></li>
                            <li><span class="f32"><strong>`+ countryData[0].countryName + `</strong></span></li>
                          </ul>
                          </div>
                          
                          <div class="table-responsive">
                            <table class="table">
                              <tr>
                                <td class="active">Year</td>
                                <td colspan="2" class="success">` + countryData[0].year + `</td>
                              </tr>
                              <tr>
                                <td class="active">Overall Score</td>
                                <td colspan="2" class="success">` +  overallVal + `</td>
                                
                              </tr>
                              <tr>
                                <td class="active">Rank</td>
                                <td colspan="2" class="success">` + countryData[0].rank + `</td>
                             
                              </tr>
                            </table>
                          </div>
                        </div>`;
      return labelTemplate;
    }

  }


  getCountryValue(data, year, id) {
    return data.filter(e => {
      if (e.year == year && e.countryISO == id) {
        return e;
      }
    });
  }

  // reset layer style after onhover/ mouse out form layer
  resetStyle(e: any) {
    this.geoJsonLayer(e.target);
  }


  // legend 
  renderLegend() {

  }

  // remove layer form map
  removeGeoLayer = function () {
    if (this.geoJsonLayer != undefined) {

      this.mapObj.removeLayer(this.geoJsonLayer);
    }
  }


  // legendScaleHighlight
  highLightLegendScale(color: any) {
    this.highlightDirective.highlight(color);

  }

  // legendFilter onclick
  renderFilteredMap(scaleRange: any) {
    let copyObj = Object.assign([], this.selectedDataHolderTemp);
    this.selectedDataHolder = copyObj.filter(e => {
      if (e[this.displayAttrObj.baseClrKey] >= scaleRange[0] && e[this.displayAttrObj.baseClrKey] <= scaleRange[1]) {
        return e;
      }
    });
    this.removeGeoLayer();
    this.loadlayer();
  }

  getFeatureFillClr = function (value) {
    let config = this.displayAttrObj.legend;
    var returnColor = '#eee';
    if (config.dataType == 'NUMBER' || config.dataType == 'PERCENTAGE') {
      if (value != undefined && value != -1) {
        let val: any = Number(value);
        if (val > config.scaleRange[[config.scaleRange.length - 1][0]]) {
          returnColor = config.scaleColor[config.scaleColor.length - 1];
        }
        else {
          for (var i = 0; i < config.scaleRange.length; i++) {

            if (value >= config.scaleRange[i][0] && value < config.scaleRange[i][1]) {
              returnColor = config.scaleColor[i];
              break;
            }

            // if (value > config.scaleRange[i][0] && value < config.scaleRange[i][1]) {
            //   returnColor = config.scaleColor[i];
            //   break;
            // }
            // if (value == config.scaleRange[i][0] || value == config.scaleRange[i][1]) {
            //   returnColor = config.scaleColor[i];
            //   break;
            // }
            // if (value > config.scaleRange[i][1] && value < config.scaleRange[i+1][0]) {
            //   returnColor = config.scaleColor[i];
            //   break;
            // }
          }
        }
      }
    }

    if (config.dataType == 'STRING') {
      for (var i = 0; i < config.scaleRange.length; i++) {
        if (value == config.scaleRange[i]) {
          returnColor = config.scaleColor[i];
          break;
        }
      }
    }
    return returnColor;
  }



  switchIndicator = function (indicatorValue: any, year: any) {
    //this.onSliderPause();
    switch (indicatorValue) {
      case "generation-of-regulations":
        this.loadGenerationOfRegulations(indicatorValue, year);
        break;
      case "most-dynamic-countries-by-rank":
        this.loadmostDynamicCountriesByRank(indicatorValue);
        break;
      case "most-dynamic-countries-by-score":
        this.loadmostDynamicCountriesByScore(indicatorValue);
        break;
    }
  }


  loadGenerationOfRegulations(indicatorValue, year) {

    this.selectedOptionValue = indicatorValue;
    this.selectedOptionName = this.selectionOptionMapping[this.selectedOptionValue];
    this.displayAttrObj.baseClrKey = 'overall';
    this.displayAttrObj.label.push({ name: 'Year', key: 'year' });
    this.displayAttrObj.label.push({ name: 'Score', key: 'overall' });
    this.displayAttrObj.label.push({ name: 'Rank', key: 'rank' });

    this.displayAttrObj.legend.title = 'Generations of ICT Regulation';
    this.displayAttrObj.legend.dataType = 'NUMBER',
      this.displayAttrObj.legend.scaleRange = [[0, 39.99], [40, 69.99], [70, 84.99], [85, 100]];
    this.displayAttrObj.legend.scaleColor = ['#8CACAF', '#5EC8D3', '#5BA2C1', '#7A0C24'];
    this.displayAttrObj.legend.scaleLabel = ['1st generation: Tracker score 0 - 40', '2nd generation: 40 - 70', '3rd generation: 70 - 85', '4th generation: 85 - 100'];

    this.mapService.getGenerationOfRegulationsData().then(responseObj => {
      this.dataHolder = responseObj;
      this.selectedDataHolder = responseObj.filter(e => {
        if (e.year == this.selectedYear) {
          return e;
        }
      });
      this.selectedDataHolderTemp = Object.assign([], this.selectedDataHolder);  // make a copy of filterd object
      this.loadSelectedIndicatorMap();

    });
  }

  loadmostDynamicCountriesByRank(indicatorValue) {

    this.selectedOptionValue = indicatorValue;
    this.selectedOptionValue = indicatorValue;
    this.selectedOptionName = this.selectionOptionMapping[this.selectedOptionValue];
    this.displayAttrObj.baseClrKey = 'endYearValue';
    this.displayAttrObj.label.push({ name: 'Year', key: 'endYear' });
    this.displayAttrObj.label.push({ name: 'Year', key: 'startYear' });
    this.displayAttrObj.label.push({ name: 'Score', key: 'endYearValue' });
    this.displayAttrObj.label.push({ name: 'Score', key: 'startYearValue' });
    this.displayAttrObj.label.push({ name: 'Rank', key: 'endYearRank' });
    this.displayAttrObj.label.push({ name: 'Rank', key: 'startYearRank' });
    this.displayAttrObj.label.push({ name: 'Rank Earned', key: 'rankEarned' });
    this.displayAttrObj.label.push({ name: 'Value Earned', key: 'valueEarned' });

    this.displayAttrObj.legend.title = 'Generations of ICT Regulation';
    this.displayAttrObj.legend.dataType = 'NUMBER',
      this.displayAttrObj.legend.scaleRange = [[0, 40], [41, 69], [70, 84], [85, 100]];
    this.displayAttrObj.legend.scaleColor = ['Red', 'Yellow', 'Green', 'Blue'];
    this.displayAttrObj.legend.scaleLabel = ['1st generation: Tracker score 0 - <40', '2nd generation:  >=40  <70', '3rd generation:  >=70  <85', '4th generation:  >=85'];

    this.mapService.getMostDynamicCountriesDataRank().then(responseObj => {
      this.dataHolder = responseObj;
      this.selectedDataHolder = responseObj;
      this.selectedDataHolderTemp = Object.assign([], this.selectedDataHolder);  // make a copy of filterd object
      this.loadSelectedIndicatorMap();

    });

  }

  loadmostDynamicCountriesByScore(indicatorValue) {

    this.selectedOptionValue = indicatorValue;
    this.selectedOptionValue = indicatorValue;
    this.selectedOptionName = this.selectionOptionMapping[this.selectedOptionValue];
    this.displayAttrObj.baseClrKey = 'endYearValue';
    this.displayAttrObj.label.push({ name: 'Year', key: 'endYear' });
    this.displayAttrObj.label.push({ name: 'Year', key: 'startYear' });
    this.displayAttrObj.label.push({ name: 'Score', key: 'endYearValue' });
    this.displayAttrObj.label.push({ name: 'Score', key: 'startYearValue' });
    this.displayAttrObj.label.push({ name: 'Rank', key: 'endYearRank' });
    this.displayAttrObj.label.push({ name: 'Rank', key: 'startYearRank' });
    this.displayAttrObj.label.push({ name: 'Rank Earned', key: 'rankEarned' });
    this.displayAttrObj.label.push({ name: 'Value Earned', key: 'valueEarned' });

    this.displayAttrObj.legend.title = 'Generations of ICT Regulation';
    this.displayAttrObj.legend.dataType = 'NUMBER',
      this.displayAttrObj.legend.scaleRange = [[0, 40], [41, 69], [70, 84], [85, 100]];
    this.displayAttrObj.legend.scaleColor = ['Red', 'Yellow', 'Green', 'Blue'];
    this.displayAttrObj.legend.scaleLabel = ['1st generation: Tracker score 0 - <40', '2nd generation:  >=40  <70', '3rd generation:  >=70  <85', '4th generation:  >=85'];

    this.mapService.getMostDynamicCountriesDataValue().then(responseObj => {
      this.dataHolder = responseObj;
      this.selectedDataHolder = responseObj;
      this.selectedDataHolderTemp = Object.assign([], this.selectedDataHolder);  // make a copy of filterd object
      this.loadSelectedIndicatorMap();

    });

  }

  loadSelectedIndicatorMap() {

    this.removeGeoLayer();
    this.loadlayer();

  }


  // year selector 

  onSlidePreviousYear() {

    let yearIndex = this.yearSlider.container.indexOf(this.selectedYear);
    if (yearIndex != 0) {
      this.selectedYear = this.yearSlider.container[yearIndex - 1];
    }
    this.router.navigate(['map'], { queryParams: { ind: this.selectedOptionValue, year: this.selectedYear } });

  }

  onSliderPlay() {

    let initialYear = this.selectedYear;
    this.playInterval = setInterval(() => {

      this.selectedYear = this.yearSlider.container[(this.yearSlider.container.indexOf(this.selectedYear) + 1)];

      if (this.selectedYear == undefined) {
        this.selectedYear = this.yearSlider.container[this.yearSlider.container.indexOf(this.yearSlider.container[0])];
      }

      if (initialYear == this.selectedYear) {            // break interval afler one cycle complete
        //clearInterval(this.playInterval);
        this.onSliderPause();
      }

      this.router.navigate(['map'], { queryParams: { ind: this.selectedOptionValue, year: this.selectedYear } });

    }, 3000);
  }

  onSliderPause() {
    clearInterval(this.playInterval);
    this.playInterval = undefined;
  }

  onSlideNextYear() {

    let yearIndex = this.yearSlider.container.indexOf(this.selectedYear);
    if (yearIndex != this.yearSlider.container.lenght - 1) {
      this.selectedYear = this.yearSlider.container[yearIndex + 1];
    }
    this.router.navigate(['map'], { queryParams: { ind: this.selectedOptionValue, year: this.selectedYear } });

  }

  //**********************Map functionality End**********************//

  onIndicatorSelect(paramVal: any) {
    //  console.log(value);
    // this.selectedOptionValue = value;
    this.router.navigate(['map'], { queryParams: { ind: paramVal[0], year: paramVal[1] } });
  }

 // print page

    // print page 
   print(): void {
     let docprint = window.open("about:blank", "_blank"); 
     let oTable = document.getElementById("print-section");
     docprint.document.open();
     docprint.document.write('<html><head><title>Map</title>'); 
     docprint.document.write( "<link rel=\"stylesheet\" href=\"./assets/print/map-print.css\" type=\"text/css\" media=\"print\"/>" );
    // docprint.document.write( "<link rel=\"stylesheet\" href=\"./assets/print/flag-icon-css/css/flag-icon.min.css\" type=\"text/css\" media=\"all\"/>" );
    // docprint.document.write( "<link rel=\"stylesheet\" href=\"styles.bundle.css\" type=\"text/css\" media=\"print\"/>" );
     docprint.document.write('</head><body><center>');
     docprint.document.write(`
      <div class="text-left">
            <h3> Generation of Regulations ( Year ` + this.selectedYear + ` )</h3>
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


  // downloadImage

  download() {
    let dimensions = this.mapObj.getSize();
    let mainCanvas = document.createElement('canvas');
    mainCanvas.width = dimensions.x;
    mainCanvas.height = dimensions.y + 85;
    let ctx = mainCanvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, dimensions.x, dimensions.y + 85);
    var canvas1 = jQuery('<canvas/>', { id: 'mycanvas', height: dimensions.y, width: dimensions.x });
    canvas1.css('border', 'solid 1px white');
    jQuery('body').append(canvas1);

    let selectedYear = this.selectedYear;

    jQuery('.leaflet-overlay-pane svg').removeAttr('xmlns');
    if (!/*@cc_on!@*/
      false) {
      jQuery('.leaflet-overlay-pane').attr('xmlns:xlink', "http://www.w3.org/1999/xlink");
    }
    setTimeout(function () {
      var svg = jQuery('.leaflet-overlay-pane').html();
      //window:any;
      //window.svg = svg;
      canvg(document.getElementById('mycanvas'), svg, { ignoreClear: false });
      setTimeout(function () {
        let mainCanvasMap: any = document.getElementById('mycanvas');
        let context = mainCanvasMap.getContext('2d');
        context.font = "20px Helvetica Neue, Helvetica, Arial, sans-serif";
        context.fillText("Year: " + selectedYear, 0, dimensions.y - 5);
        let mapDataURL = mainCanvasMap.toDataURL("image/png");

        html2canvas(jQuery(".export-footer"), {
          onrendered: function (canvas) {
            let legendDataURL = canvas.toDataURL("image/png");

            let mapImage = new Image();
            mapImage.onload = function() {
               ctx.drawImage(mapImage, 30, 30, dimensions.x, dimensions.y);
            }
            mapImage.src = mapDataURL;


            let legendImage = new Image();
            legendImage.onload = function() {
              ctx.drawImage(legendImage, 2, dimensions.y - 30, jQuery(".export-footer").width(), jQuery(".export-footer").height());
            }
            legendImage.src = legendDataURL;
            
            let mergeImage;
            setTimeout(function() {
               mergeImage = mainCanvas.toDataURL('image/jpeg', 1.0);
            }, 400);
           
            
            setTimeout(function () {
              var link = document.createElement("a");
              //link.setAttribute("download", fn);
              link.download = "generation-of-regulations-" + selectedYear;
              link.href = mergeImage;   
              link.click();
               jQuery('#mycanvas').remove(); 
            }, 600)

          }
        });
      }, 600);
    }, 700);

  }
}

