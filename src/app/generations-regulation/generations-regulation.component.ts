import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


import { GenerationsRegulationService } from './generations-regulation.service';

declare var Highcharts: any;

@Component({
  selector: 'app-generations-regulation',
  templateUrl: './generations-regulation.component.html',
  styleUrls: ['./generations-regulation.component.css']
})
export class GenerationsRegulationComponent implements OnInit {

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private generationsRegulationService:GenerationsRegulationService
  ) { }

 dropDownItemsContainer = [
    { "name": "World", "iso":"WORLD" , mapped: ["1","2", "3", "4", "5", "6", "7", "8"] },
    { "name": "Arab States", "iso":"ABS", mapped: ["2"] },
    { "name": "CIS", "iso":"CIS", mapped: ["3"] },
    { "name": "East Asia & Pacific","iso":"EAP", mapped: ["4"] },
    { "name": "Europe", "iso":"EUR", mapped: ["5"] },
    { "name": "Latin America & the Caribbean", "iso":"LTC",  mapped: ["6"] },
  //  { "name": "North America", mapped: ["7"] },
    { "name": "South Asia", "iso":"SAA", mapped: ["8"] },
    { "name": "Sub-Saharan Africa", "iso":"", mapped: [] },
    { "name": "Americas ( North America + Latin America & the Caribbean )", "iso":"AMR", mapped: ["7", "6"] },
    { "name": "Asia ( East Asia & Pacific + South Asia )", "iso":"ANP", mapped: ["4", "8"] }
  ];
  
  shareTitle = "Share:";
  fbInner = "<img src='./assets/images/custom-facebook.svg'>";
  twitterInner = "<img src='./assets/images/custom-twitter.svg'>";
  inInner = "<img src='./assets/images/custom-linkedin.svg'>";
  generationsRegulationDataHolder;
  parsedChartDataHolder;
  lineChartDataHolder;
  
  currentSelectedItemForAreaChart =  { "name": "World", mapped: ["1","2", "3", "4", "5", "6", "7", "8"] };
  currentSelectedItemForDonutChart = { "name": "World", mapped: ["1","2", "3", "4", "5", "6", "7", "8"] };
  currentSelectedItemForLineChart = { "name": "World" , "iso":"WORLD",  mapped: ["1","2", "3", "4", "5", "6", "7", "8"] };

  ngOnInit() {
    this.getGenerationsOfRegulationData();
    this.getLineChartData();
  }


 getGenerationsOfRegulationData() {
  this.generationsRegulationService
        .getGenerationsOfRegulationData().
       then(responseObj => {
          this.generationsRegulationDataHolder = responseObj;
          this.parsedChartDataHolder = this.getParseDataForCharts();
          this.loadAreaChart(this.currentSelectedItemForAreaChart);
          this.loadDonutChart("donutchart1-container", this.currentSelectedItemForDonutChart, "2007", "FIRST-INDEX");
          this.loadDonutChart("donutchart2-container", this.currentSelectedItemForDonutChart, "2015", "LAST-INDEX");
       });
 }

 getLineChartData() {
     this.generationsRegulationService
        .getLineChartData()
        .then(responseObj =>{
            this.lineChartDataHolder = responseObj;
            this.loadLineChart(this.currentSelectedItemForLineChart);
        });
 }

  // charts

    getParseDataForCharts() {
        var years = this.generationsRegulationDataHolder;
        //console.log(years);
        var countedNames = years.reduce((allNames, name) => { 
            if(!allNames['count'][name.year]) {                                   // number of countries in a particular year
                allNames['count'][name.year] = '';
            }

            allNames['count'][name.year]++;

            if(!allNames['data'][name.year]) {
                allNames['data'][name.year] = {};
            }
            var groupName =  this.getGenerationOfRegulationGroup(name.overall);

            if(!allNames['data'][name.year][groupName]) {
                allNames['data'][name.year][groupName] = {};
            }

            if(!allNames['data'][name.year][groupName][name.regionId]) {
                allNames['data'][name.year][groupName][name.regionId] = '';
            }

            allNames['data'][name.year][groupName][name.regionId]++;
            return allNames;
        }, {"data":{}, "count":{}});

        return countedNames;
    }

 getGenerationOfRegulationGroup(value) {
       return   value >=85                ?     'G4' :  
                value >=70 && value < 85  ?     'G3':
                value >=40 && value < 70  ?     'G2':
                value >=0  && value < 40  ?     'G1':
                                                 '';
      }

//  Start first Chart

loadAreaChart(selectedItem) {
var seriesData =  this.parseDataForChartAreaChart(selectedItem);
Highcharts.chart('areachart-container', {
            chart: {
                type: 'area'
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            exporting: {
                enabled: false
            },
            xAxis: {
                categories: [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015],
                tickmarkPlacement: 'on',
                title: {
                    enabled: false
                }
            },
            credits: {
            enabled: false
            },
            yAxis: {
                title: {
                    text: null
                },
                labels: {
                    enabled:false,
                    formatter: function() {
                    return this.value+"%";
                    }
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b><br/>',
                split: true
            },
            plotOptions: {
                area: {
                    stacking: 'percent',
                    lineColor: '#ffffff',
                    lineWidth: 1,
                    marker: {
                        lineWidth: 1,
                        lineColor: '#ffffff'
                    }
                }
            },
            series:seriesData.reverse()
        }); 
  }

 parseDataForChartAreaChart(selectedItem) {
     
    var mapping = selectedItem.mapped;
    var countedNames = this.parsedChartDataHolder;
    var seriesContainer = [];
    var categoriesContainer = countedNames['data'];//Object.keys(countedNames);
    var groupNames = ["G1", "G2", "G3", "G4"];
    var groupColors = ["#8CACAF", "#5EC8D3", "#5BA2C1", "#7A0C24"];
    for(var i = 0; i < groupNames.length; i++) {

         var obj = {};
         obj['name'] = groupNames[i];
         obj['data'] = [];
         obj['color'] = groupColors[i];

        for(var j in categoriesContainer) {
            
            if(categoriesContainer[j].hasOwnProperty(groupNames[i])){
                var count = 0;
       //         console.log(categoriesContainer[j][groupNames[i]]);
                //if(true) {

                    for(var k in categoriesContainer[j][groupNames[i]]) {
                            if(mapping.indexOf(k) != -1)
                            count +=categoriesContainer[j][groupNames[i]][k];
                     }

                    obj['data'].push(count);
                //}
            }  
        } 
         seriesContainer.push(obj);
    }

      return seriesContainer;
 }

onChangeAreaChart(selectedItem) {
  
    this.currentSelectedItemForAreaChart = selectedItem;
    this.loadAreaChart(selectedItem);
}

// end first chart





// load donut chart

 loadDonutChart(chartContainer, selectedItem, year, indexNumber) {
     //console.log(this.generationsRegulationDataHolder);
let seriesData = this.parseDataForChartDonutChart(this.parseDataForChartAreaChart(selectedItem), indexNumber);
let totalCountries = 0;
let setTitle;
let regionName = selectedItem.name;
 Highcharts.setOptions({
     colors: ['#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263',      '#6AF9C4']
    });
     Highcharts.chart(chartContainer, {
    chart: {
        type: 'pie',
         events: {
            load: function(event) {
               
                    for (var i = 0, len = this.series[0].yData.length; i < len; i++) {
                        totalCountries += this.series[0].yData[i];
                    }
                    this.setTitle({ text: totalCountries + " countries" });
                    //console.log(totalCountries);
                    setTitle = this.setTitle.bind(this);
            }
        }
    },
    title: {
            verticalAlign: 'middle',
            floating: true,
            text: totalCountries
    },
     exporting: {
                enabled: false
    },
    credits:{
        enabled:false
    },
    subtitle: {
        text: regionName + ", " + year,
        style: {
            color: '#000',
            fontWeight: 'bold',
            fontSize: '12px'
        }
    },
    plotOptions: {
        // pie: {
        //     innerSize: '70%',
        //     showInLegend: true,
        // }
        pie : {
         innerSize: '70%',
 		showInLegend : true,
 		center : ['50%', '50%'],
 		point : {
 			events : {
 				legendItemClick : function () {
                      
                     // take some time because object recreates and take some time to update values 
                       setTimeout(()=> {
                            let postText = this.total <= 1 ? "country" : "countries";
                            setTitle({ text: this.total + " " + postText });
                       }, 300);
                       
 				}
 			}
 		},
 	},

    },
    series: [{
        name: 'Number of countries',
        data: seriesData
    }]
});

 }

 parseDataForChartDonutChart(dataArray, indexNumber) {
     var seriesDataContainer = [];
     for(var i = 0; i < dataArray.length; i++) {
         var seriesDataObj = {};
         seriesDataObj["name"] = dataArray[i]['name'];
         seriesDataObj["y"] = indexNumber == "FIRST-INDEX" ? dataArray[i]['data'][0] : dataArray[i]['data'][dataArray[i]['data'].length - 1];
         seriesDataObj["color"] = dataArray[i]['color'];
         seriesDataContainer.push(seriesDataObj);
     }
     
     return seriesDataContainer
 }

onChangeDonutChart(selectedItem) {
  
    this.currentSelectedItemForDonutChart = selectedItem;
    this.loadDonutChart("donutchart1-container", this.currentSelectedItemForDonutChart, "2007", "FIRST-INDEX");
    this.loadDonutChart("donutchart2-container", this.currentSelectedItemForDonutChart, "2015", "LAST-INDEX");
}

// end chart 3

// start chart 3

 // load linechart
loadLineChart(selectedItem) {
    let seriesData = this.lineChartDataHolder[selectedItem['iso']];
    Highcharts.chart('linechart-container', {
    chart: {
        type: 'line'
    },
    title: {
        text: ''
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        categories: [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015],
    },
    yAxis: {
        title: {
            text: ''
        },
         labels: {
             enabled:false
        }
    },
    exporting: {
                enabled: false
    },
    
    credits:{
        enabled:false
    },
    plotOptions: {
        line: {
            dataLabels: {
                enabled: true
            },
            enableMouseTracking: true
        }
    },
    series: seriesData
});
}

onChangeLineChart(selectedItem) {

   this.currentSelectedItemForLineChart = selectedItem;
   this.loadLineChart(this.currentSelectedItemForLineChart);
}


// Print and save 

print() {
   var docprint = window.open("about:blank", "_blank"); 
     var oTable = document.getElementById("print-section");
     docprint.document.open();
     docprint.document.write('<html><head><title>Generations of Regulation</title>'); 
    // docprint.document.write( "<link rel=\"stylesheet\" href=\"styles.bundle.css\" type=\"text/css\" media=\"print\"/>" );
    docprint.document.write( "<link rel=\"stylesheet\" href=\"./assets/print/bootstrap.min.css\" type=\"text/css\" media=\"print\"/>" );
     docprint.document.write( "<link rel=\"stylesheet\" href=\"./assets/print/generations-regulation-print.css\" type=\"text/css\" media=\"print\"/>" );
     docprint.document.write('</head><body><center>');
     docprint.document.write(`
      <div class="">
          <h4>Generations of Regulation </h4>
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

// download
 download() {

 }
}


