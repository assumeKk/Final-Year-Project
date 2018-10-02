import { Pipe, PipeTransform } from '@angular/core';
import { AppService } from './app.service';

import { filter } from 'rxjs/operators';
import { take } from 'rxjs/operators';

@Pipe({
  name: 'idParser',
})
export class IdParserPipe implements PipeTransform {
  constructor(private appService: AppService) { };
  transform(value: any, type, objectName): any {
    if (value) {
      switch (type) {
        case 'labroom':// get lab name
          return this.appService.getLabroomName(value).map(res => {
            return res['name'];

          });

        case 'feedback'://get feedback info
          return this.appService.getStudent(value).map(res => {
            if (res) {
              return res[objectName];
            }
          });

        case 'student'://get student

          return this.appService.getStudent(value).map(res => {
            return res[objectName];
          });
        case 'student-list-size'://get student size
          return this.appService.getLabName(value).map(res => {
            return Object.keys(res['studentList']).length;
          });

        case 'monthly-student-help-size'://get number of total help from queue history
          return this.appService.getLabName(value).map(res => {
            var m = (new Date().getMonth() + 1).toString();
            (m.length == 1) && (m = '0' + m);

            let totalHelpRequested = 0;

            let queueHistoryObj = res['days'];
            if (queueHistoryObj) {
              let keys = Object.keys(queueHistoryObj);

              for (let key of keys) {

                let newKey = key.charAt(4);
                newKey += key.charAt(5);

                if (newKey == m) {
                  let tempObj = res['days'][key]['queueHistory'];
                  if (tempObj) {
                    for (let item of Object.keys(tempObj)) {
                      totalHelpRequested += Object.keys(tempObj[item]).length;
                    }
                  }
                }
              }
            } else {
              return 0;
            }
            return totalHelpRequested;
          }

          );

        case 'monthly-longest-waiting-time'://get longest waiting in month
          return this.appService.getLabName(value).map(res => {

            if (res) {

            }
          });


        case 'monthly-attending-rate'://get month attending rate

          return this.appService.getLabName(value).map(res => {

            var monthArr = [];
            if (res['days']) {
              for (var i = 1; i < 13; i++) {
                let rate = 0;
                let number = "0%";

                let m = i.toString();
                (m.length == 1) && (m = '0' + m);
                let totalHelpRequested = 0;
                let keys = Object.keys(res['days']);
                let studentListObj = res['studentList'];
                let totalDay = 0;

                for (let key of keys) {

                  let newKey = key.charAt(4);//get first month character 01
                  newKey += key.charAt(5);//get second month character 123456789

                  if (newKey == m) {
                    let attendListObj = res['days'][key]['attendingList'];
                    if (attendListObj) {
                      rate += (Object.keys(attendListObj).length / Object.keys(studentListObj).length);
                    }

                    let tempObj = res['days'][key]['queueHistory'];

                    if (tempObj) {
                      for (let item of Object.keys(tempObj)) {
                        totalHelpRequested += Object.keys(tempObj[item]).length;
                      }

                    }

                    totalDay++;

                  }


                }
                if (rate) {

                  number = (rate / totalDay * 100).toFixed(2) + '%';
                  let helpRequested = (totalHelpRequested / totalDay);
                  helpRequested = Math.round(helpRequested);
                  monthArr.push({ month: m, averageTime: number, averageHelp: helpRequested });
                }
              }

            }
            return monthArr;
          }

          );
        case 'average-waiting-time'://get average waiting time in the queue
          return this.appService.getLabName(value).map(res => {
            let queueHistoryObj = res['days'][objectName]['queueHistory'];
            let totalWaitingTime = 0;
            let totalWaitingPerson = 0;

            for (let userId of Object.keys(queueHistoryObj)) {
              let user = queueHistoryObj[userId];

              for (let item of Object.keys(user)) {
                if (user[item]['waitingTime'] > 0) {
                  totalWaitingTime += user[item]['waitingTime'];
                  totalWaitingPerson++;
                }
              }
            }

            return Math.round(totalWaitingTime / totalWaitingPerson / 1000) + " second(s)";
          });


        case 'longest-waiting-time'://get longest waiting time in the queue
          return this.appService.getLabName(value).map(res => {
            let longestTime = 0;

            let queueHistoryObj = res['days'][objectName]['queueHistory'];
            for (let userId of Object.keys(queueHistoryObj)) {
              let user = queueHistoryObj[userId];

              for (let item of Object.keys(user)) {
                if (user[item]['waitingTime'] > longestTime) {
                  longestTime = user[item]['waitingTime'];
                }
              }
            }

            return Math.round(longestTime / 1000) + " second(s)";

          });
        case 'shortest-waiting-time'://get shortest waiting time
          return this.appService.getLabName(value).map(res => {
            let shortestTime = 100000000000000000;

            let queueHistoryObj = res['days'][objectName]['queueHistory'];
            for (let userId of Object.keys(queueHistoryObj)) {
              let user = queueHistoryObj[userId];

              for (let item of Object.keys(user)) {
                if (user[item]['waitingTime'] < shortestTime && user[item]['waitingTime'] > 0) {
                  shortestTime = user[item]['waitingTime'];
                }
              }
            }

            return Math.round(shortestTime / 1000) + " second(s)";

          });
        case 'student-help-size'://get student help size
          return this.appService.getLabName(value).map(res => {
            let totalHelpRequested = 0;
            let queueHistoryObj = res['days'][objectName]['queueHistory'];
            if (queueHistoryObj) {
              for (let item of Object.keys(queueHistoryObj)) {
                totalHelpRequested += Object.keys(queueHistoryObj[item]).length;
              }
              return totalHelpRequested;
            } else {
              return 0;
            }

          });

        case 'student-attending-rate'://get attending rate in day
          return this.appService.getLabName(value).map(res => {

            if (res) {

              let attendListObj = res['days'][objectName]['attendingList'];
              let studentListObj = res['studentList'];

              if (studentListObj && attendListObj) {


                let rate = (Object.keys(attendListObj).length / Object.keys(studentListObj).length * 100).toFixed(2);
                return rate + '%';
              } else {
                return '0%';
              }
            }
            else {
              return '0%';
            }
          });

        case 'ta-feedback-rating'://get average TA feedback rating
          return this.appService.getLabName(value).map(res => {
            console.log("LABROOM ID" + value);
            let totalRate = 0;
            let count = 0;
            let queueHistoryObj = res['days'][objectName]['queueHistory'];
            console.log("feedback" + queueHistoryObj);
            for (let userId of Object.keys(queueHistoryObj)) {
              let user = queueHistoryObj[userId];
              for (let item of Object.keys(user)) {
                if (user[item]['rate'] != 0 && user[item]['rate'] > 0) {
                  totalRate += user[item]['rate']
                  count++;
                  console.log("check: " + totalRate);
                }
              }
            }
            return totalRate / count;
          });

        case 'lab-live'://get lab live, so students and TAs can access it
          let arr = [];

          for (let key of value) {

            let sub = this.appService.getLabName(key).subscribe(res => {
              if (res) {
                if (res['slots']) {
                  let startDate = new Date(res['startDate']);
                  let endDate = new Date(res['endDate']);
                  let currentDate = new Date();
                  if (currentDate.getTime() <= endDate.getTime() && currentDate.getTime() >= startDate.getTime()) {


                    for (let date of res['slots']) {

                      let startHour = parseInt(date['startHour']);
                      let endHour = parseInt(date['endHour']);
                      console.log(currentDate.getDay());
                      if (currentDate.getHours() >= startHour && currentDate.getDay() == parseInt(date['weekday']) && currentDate.getHours() <= endHour) {
                        if (!this.isDuplicated(arr, key)) {
                          arr.push(key);
                        }
                      }
                    }
                    sub.unsubscribe();
                  }
                }
              }
            })

          }

          return arr;

        default:
          return null;

      }

    } else {
      return 'empty';
    }
  }

  isDuplicated(array, key) {
    let temp = false;
    array.forEach(element => {
      if (element == key) {
        // console.log('duplicate..');
        temp = true;
      }
    });
    return temp;

  }
  isLive(lab) {
    console.log(lab);
    return false;
  }
}
