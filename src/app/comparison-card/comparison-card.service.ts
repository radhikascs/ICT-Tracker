import { Injectable } from '@angular/core';

import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class ComparisonCardService {

private countryListUrl = 'assets/metadata/country-list.json';

 private dataUrl = 'assets/data/ict_2016.json';  // URL to web api

  constructor(private http: Http) { }

   getCountryList(): Promise<any> {
    return this.http.get(this.countryListUrl)
                .toPromise()
                .then(response => response.json())
                .catch(this.handleError);
  }

  getComparionCardData(): Promise<any> {
    return this.http.get(this.dataUrl)
               .toPromise()
               .then(response => response.json())
               .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  getSortedData(data:any) {
    return data
              .sort(function(a, b) {
                var nameA = a.properties.name.toUpperCase(); // ignore upper and lowercase
                var nameB = b.properties.name.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
              ​
                // names must be equal
                return 0;
              });
        } 
}
