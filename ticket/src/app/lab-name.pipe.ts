import { Pipe, PipeTransform } from '@angular/core';
import { AppService } from './app.service';

@Pipe({
  name: 'labName'
})
export class LabNamePipe implements PipeTransform {
  constructor(private appService: AppService) { };
  transform(value: any, args?: any): any {
    // let name = null;
    // console.log(
    return this.appService.getLabName(value).map(res => {
      return res['name'];
    })
    // return name;
  }

}
