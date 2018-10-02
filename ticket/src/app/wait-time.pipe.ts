import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';


@Pipe({
  name: 'waitTime'
})
export class WaitTimePipe implements PipeTransform {

  public waitingTime: any = {};

  observable: Observable<any>;


  transform(value: any, args?: any): any {

    return this.getTimeObservable(value);
  }

  getTimeObservable(value) {
    return Observable
      .interval(1000)
      .map((v) => {

        let myDate = Date.now();
        let oldData = value;

        this.waitingTime = Math.abs(myDate - oldData);
        return this.convertMillisecondsToDigitalClock(this.waitingTime).clock;
      });
  }



  // https://stackoverflow.com/questions/13601737/how-to-convert-milliseconds-into-a-readable-date-minutesseconds-format
  // CONVERT MILLISECONDS TO DIGITAL CLOCK FORMAT
  convertMillisecondsToDigitalClock(ms) {
    let hours = Math.floor(ms / 3600000), // 1 Hour = 36000 Milliseconds
      minutes = Math.floor((ms % 3600000) / 60000), // 1 Minutes = 60000 Milliseconds
      seconds = Math.floor(((ms % 360000) % 60000) / 1000) // 1 Second = 1000 Milliseconds
    return {
      hours: hours,
      minutes: minutes,
      seconds: seconds,
      clock: hours + ":" + minutes + ":" + seconds
    };
  }

}
