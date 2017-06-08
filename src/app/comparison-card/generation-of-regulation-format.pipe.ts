import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'generationOfRegulationFormat'
})
export class GenerationOfRegulationFormatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value >= 85 ? '4th generation' :  
           value >=70 && value <85  ? '3rd generation':
           value >=40 && value <70  ? '2nd generation':
           value >=0 && value  <40    ? '1st generation':
           '';
  } 

}
