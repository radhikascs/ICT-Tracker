import { Injectable } from '@angular/core';
import { Headers, Http, Response} from '@angular/http';

@Injectable()
export class GenerationsRegulationService {

 constructor(private http: Http) { }

private dataUrl = 'assets/data/ict_2016.json';  // URL to web api
private lineChartDataUrl = 'assets/data/generationofregulation_chart3.json';  // URL to web api

  getGenerationsOfRegulationData():Promise<any> {
    return this.http.get(this.dataUrl)
                .toPromise()
                .then(response => response.json())
                .catch(this.handleError);  
  }


getLineChartData():Promise<any> {
  return this.http.get(this.lineChartDataUrl)
                .toPromise()
                .then(response => response.json())
                .catch(this.handleError);  
}


  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
