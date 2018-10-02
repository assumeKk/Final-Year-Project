import { PipeTransform, Pipe } from "@angular/core";
import { Observable } from "rxjs/Observable";
/**
 * parse key to get object data
 */
@Pipe({ name: 'keys', pure: false })
export class KeysPipe implements PipeTransform {
  transform(value, args: any[] = null): any {
    if (value)
      return Object.keys(value);
    else {
      return [];
    }
  }
}