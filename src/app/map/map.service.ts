import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class MapService {

   private shapeUrl = 'assets/shapefile/countries.json';  // URL to web api
   //private dataUrl = 'assets/data/ict_2016.json';  // URL to web api

   constructor(private http: Http) { }

  getShapeFile(): Promise<any> {
    return this.http.get(this.shapeUrl)
               .toPromise()
               .then(response => response.json())
               .catch(this.handleError);
  }

  getGenerationOfRegulationsData() {
    return this.http.get('assets/data/ict_2016.json')
               .toPromise()
               .then(response => response.json())
               .catch(this.handleError);
  }

 getMostDynamicCountriesDataRank() {
    return this.http.get('assets/data/most_dynamic_countries_rank_earned.json')
               .toPromise()
               .then(response => response.json())
               .catch(this.handleError);
  }

 getMostDynamicCountriesDataValue() {
    return this.http.get('assets/data/most_dynamic_countries_value_earned.json')
               .toPromise()
               .then(response => response.json())
               .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
