import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


import { Observable } from 'rxjs/Observable';


import { ComparisonCardService } from './comparison-card.service'
 
@Component({
  selector: 'app-comparison-card',
  templateUrl: './comparison-card.component.html',
  styleUrls: ['./comparison-card.component.css']
})
export class ComparisonCardComponent implements OnInit {

 countriesList:any;
 selectedCountry:string = 'Afganistan';

 comparisonCardData:any;
 comparisonCardDisplayData = [ [ [],[] ], [ [], [] ] ];        // objects for countries, left and right                    

 leftSideSelectionQ1:any;
 rightSideSelectionQ2:any;
 leftSideSelectionName:any;
 rightSideSelectionName:any;
 

  autoCompleteCountriesList: any[] = []; //=["India", "China", "USA","India", "China", "USA","India", "China", "USA"];
  defaultvalAutoCompleteRight = '';
  defaultvalAutoCompleteLeft = '';

  shareTitle = "Share:";
  fbInner = "<img src='./assets/images/custom-facebook.svg'>";
  twitterInner = "<img src='./assets/images/custom-twitter.svg'>";
  inInner = "<img src='./assets/images/custom-linkedin.svg'>";

  private sub: any;

  constructor( 
      private route: ActivatedRoute,
      private router: Router,
      private comparisonCardService:ComparisonCardService) { }


  ngOnInit() {
    this.getCountriesList();
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.leftSideSelectionQ1 = params['q1'];
        this.rightSideSelectionQ2 = params['q2'];
        this.getComparionCardData();
      });    
  }


getCountriesList() {
    this.comparisonCardService
        .getCountryList()
        .then(responseObj => {
         this.countriesList = this.comparisonCardService.getSortedData(responseObj.features);    // first sort the response object
         this.countriesList.filter( e=> {
             this.autoCompleteCountriesList.push({countryName:e.properties.name, countryISO: e.properties.iso_a3});
         });
       });
  }

  getComparionCardData() {
    this.comparisonCardService
        .getComparionCardData()
        .then(data => {

          this.comparisonCardData = data;

          let yearContiner = [];
            data.filter(e => {                                // get unique year
                if (yearContiner.indexOf(e.year) == -1) {
                  yearContiner.push(e.year);
                }
            });
          yearContiner.sort(function (a, b) { return b - a });
          this.comparisonCardDisplayData = [ [ [],[] ], [ [], [] ] ];
          this.comparisonCardData.filter(i => {
          if ((i.year == yearContiner[0] && i.countryISO == this.leftSideSelectionQ1) || (i.year == yearContiner[yearContiner.length - 1] && i.countryISO == this.leftSideSelectionQ1) ) {
            if ((i.year == yearContiner[yearContiner.length - 1])) {
               this.comparisonCardDisplayData[0][1].push(i);
            }
            if ((i.year == yearContiner[0])) {
              this.comparisonCardDisplayData[0][0].push(i);
            }
          }
           if ((i.year == yearContiner[0] && i.countryISO == this.rightSideSelectionQ2) || (i.year == yearContiner[yearContiner.length - 1] && i.countryISO == this.rightSideSelectionQ2) ) {
            if ((i.year == yearContiner[yearContiner.length - 1])) {
               this.comparisonCardDisplayData[1][1].push(i);
            }
            if ((i.year == yearContiner[0])) {
              this.comparisonCardDisplayData[1][0].push(i);
            }
          }
        });
       });
  }
  // to set by country in dropdown
  isSelected(country: any) {
    if (country.properties.iso_a3 ==  this.leftSideSelectionQ1) {
      this.leftSideSelectionName = country.properties.name;
      return true;
    }
    if (country.properties.iso_a3 ==  this.rightSideSelectionQ2) {
      this.rightSideSelectionName = country.properties.name;
      return true;
    }
  }

  onSelectLeftSelector(country:any) {
    this.leftSideSelectionQ1 = country.properties.iso_a3;
    this.defaultvalAutoCompleteLeft = '';
    this.router.navigate(['comparison-card'], { queryParams: { q1: this.leftSideSelectionQ1, q2: this.rightSideSelectionQ2} });
  }

  onSelectRightSelector(country:any) {
    this.rightSideSelectionQ2 = country.properties.iso_a3;
    this.defaultvalAutoCompleteRight = '';
    this.router.navigate(['comparison-card'], { queryParams: { q1: this.leftSideSelectionQ1, q2: this.rightSideSelectionQ2} });
  }

  myCallbackLeftAutoComp(newVal: any) {
    if(typeof newVal === "object") {
       this.leftSideSelectionQ1 = newVal.countryISO;
       this.router.navigate(['comparison-card'], { queryParams: { q1: this.leftSideSelectionQ1, q2: this.rightSideSelectionQ2} });
    }
  }

myCallbackRightAutoComp(newVal: any) {
    if(typeof newVal === "object") {
       this.rightSideSelectionQ2 = newVal.countryISO;
       this.router.navigate(['comparison-card'], { queryParams: { q1: this.leftSideSelectionQ1, q2: this.rightSideSelectionQ2} });
    }
  }



// Download data 

prepareFormatForDownloadData() {
   return [
     {" ":"Country Name", "_": this.comparisonCardDisplayData[0][0][0].countryName, "  ":  this.comparisonCardDisplayData[1][0][0].countryName },
     {" ":"Tracker Score 2015", "_": this.comparisonCardDisplayData[0][0][0].overall, "__": this.comparisonCardDisplayData[1][0][0].overall },
     {" ":"Tracker Score 2007", "_": this.comparisonCardDisplayData[0][1][0].overall, "__" : this. comparisonCardDisplayData[1][1][0].overall },
     {" ":"Generation of regulation", "_": this. comparisonCardDisplayData[0][0][0].overall, "__": this.comparisonCardDisplayData[1][0][0].overall},
     {" ":"Tracker Rank 2015", "_": this.comparisonCardDisplayData[0][0][0].rank, "__": this.comparisonCardDisplayData[1][0][0].rank},
     {" ":"Tracker Rank 2007", "_": this.comparisonCardDisplayData[0][1][0].rank, "__": this.comparisonCardDisplayData[1][1][0].rank},
     {" ":"Cluster 1. Regulatory authority", "_": this.comparisonCardDisplayData[0][0][0].cluster1RA, "__": this.comparisonCardDisplayData[1][0][0].cluster1RA},
     {" ":"Cluster 2. Regulatory mandate", "_": this.comparisonCardDisplayData[0][0][0].cluster2RM, "__": this.comparisonCardDisplayData[1][0][0].cluster2RM},
     {" ":"Cluster 3. Regulatory regime", "_": this.comparisonCardDisplayData[0][0][0].cluster3RR, "__": this.comparisonCardDisplayData[1][0][0].cluster3RR},
     {" ":"Cluster 4. Competition framework", "_": this.comparisonCardDisplayData[0][0][0].cluster4CF, "__": this.comparisonCardDisplayData[1][0][0].cluster4CF}
  ];
 }

  // download data in csv format
  download() {
    let csvData = this.ConvertToCSV(this.prepareFormatForDownloadData(),"Comparsion Report - " + this.comparisonCardDisplayData[0][0][0].countryName + " - " + this.comparisonCardDisplayData[1][0][0].countryName, true);
    let a = document.createElement("a");
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    let blob = new Blob([csvData], { type: 'text/csv' });
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = this.comparisonCardDisplayData[0][0][0].countryName + "_" + this.comparisonCardDisplayData[1][0][0].countryName + "_Comparsion_Report" + ".csv";
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


  //Print
    // print page 
  print(): void {
    var docprint = window.open("about:blank", "_blank");
    var oTable = document.getElementById("compare-card");
    docprint.document.open();
    docprint.document.write('<html><head><title>Comparison</title>');
    // docprint.document.write( "<link rel=\"stylesheet\" href=\"styles.bundle.css\" type=\"text/css\" media=\"print\"/>" );
    //docprint.document.write( "<link rel=\"stylesheet\" href=\"styles.bundle.css\" type=\"text/css\" media=\"all\"/>" );
     docprint.document.write( "<link rel=\"stylesheet\" href=\"./assets/print/bootstrap.min.css\" type=\"text/css\" media=\"print\"/>" );
    docprint.document.write("<link rel=\"stylesheet\" href=\"./assets/print/comparison-card-print.css\" type=\"text/css\" media=\"print\"/>");
    docprint.document.write('</head><body><center>');
    docprint.document.write(`
      <div class="">
         
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
      }, 1200);
    }
  }

}





