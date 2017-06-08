import { Injectable } from '@angular/core';
import { Headers, Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class CountryCardService {

 private shapeUrl = 'assets/shapefile/countries.json';  // URL to web api
 private countryListUrl = 'assets/metadata/country-list.json';
 private dataUrl = 'assets/data/ict_2016.json';  // URL to web api
 private metaDataUrl = 'assets/data/ict_countrycard_metadata.json';  // URL to web api


  constructor(private http: Http) { }


  getShapeFile(): Promise<any> {
    return this.http.get(this.shapeUrl)
               .toPromise()
               .then(response => response.json())
               .catch(this.handleError);
  }

  getCountryList(): Promise<any> {
    return this.http.get(this.countryListUrl)
                .toPromise()
                .then(response => response.json())
                .catch(this.handleError);
  }

  getCountryCardData() {
    return Observable.forkJoin(
      this.http.get(this.dataUrl).map((res:Response) => res.json()),
      this.http.get(this.metaDataUrl).map((res:Response) => res.json())
    );
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
