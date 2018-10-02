import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'week'
})
export class WeekPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case "1":
        return 'Monday';
      case "2":
        return 'Tuesday';
      case "3":
        return 'Wednesday';
      case "4":
        return 'Thursday';
      case "5":
        return 'Friday';
      case "6":
        return 'Sat';
      case "0":
        return 'Sunday';
      default:
        return 'Untitled';;
    }

  }

}
