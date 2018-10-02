import { Component, OnInit, ViewEncapsulation, Input, SimpleChange } from '@angular/core';
import { AppService, LabRoom } from '../app.service';
import { AngularFireDatabase } from 'angularfire2/database';
// import { convertValueToOutputAst } from '../../../node_modules1/@angular/compiler/src/output/value_util';

@Component({
  selector: 'app-labroom',
  templateUrl: './labroom.component.html',
  styleUrls: ['./labroom.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LabroomComponent implements OnInit {

  waitingTime: any; //student waiting time
  @Input() lab: any; //lab session
  @Input() room: any; //lab room


  public labName;

  public labRef: any;
  public currentQueueSize: number;
  public myCurrentPosition: number = null;

  public currentHelpQueue: any;
  public labData: any;

  // public addedQueue :
  public currentStudentList;
  public myTimeStamp;

  public queueHistory;

  private sub: any;

  constructor(
    private appService: AppService,
    private db: AngularFireDatabase, ) {

  }

  /**
   * calculate the students current position
   * @param res 
   */
  calcPosition(res) {
    var count = 1;
    for (let key in res) {
      if (this.myTimeStamp > res[key].timestamp) {//use timestamp to compare
        if (key !== this.appService.user.uid)
          count++;
      }
    }
    return count;
  }


  ngOnInit() {
    this.watchHelpQueue();
    this.connect();
    this.getLabName();
  }
  /**
   * the lab session name from database
   */
  getLabName() {
    this.db.object(this.appService.LABS_LIST + this.lab).valueChanges().subscribe(lab => {
      this.labName = lab['name'];
    });
  }
  /**
   * watch queue, if new student join refresh the page, and calculate position again
   */
  watchHelpQueue() {
    const ref = this.db.list(this.appService.LABS_LIST + this.lab + this.appService.HELP_QUEUE);
    let id = this.appService.user.uid;
    // Watch help queue

    // thisdb.list('/items', ref => ref.orderByChild('size').equalTo('large'))
    // db.list('/items', ref => ref.orderByChild('size').equalTo('large'));

    this.db.object(this.appService.LABS_LIST + this.lab + this.appService.QUEUE_HISTORY).valueChanges().subscribe(res => {
      if (res[id]) {
        console.log('helped record');
        console.log(res[id]);

        this.queueHistory = res[id];// save data to queue history
      }
    });

    this.db.object(this.appService.LABS_LIST + this.lab + this.appService.HELP_QUEUE).valueChanges().subscribe(res => {

      // update lab information
      // if user is already in the queue 3
      if (res) {
        this.currentHelpQueue = [];
        for (let item of Object.keys(res)) {
          this.currentHelpQueue.push({ key: item, name: res[item]['displayName'], timestamp: res[item]['timestamp'] });
        }

        if (typeof res[id] !== 'undefined') {
          this.myTimeStamp = res[id].timestamp;
          this.myCurrentPosition = this.calcPosition(res);

          var timer = 0;
          setInterval(() => {
            let myDate = Date.now();
            const oldData = this.myTimeStamp;

            this.waitingTime = Math.abs(myDate - oldData);
            this.waitingTime = this.convertMillisecondsToDigitalClock(this.waitingTime).clock;
          }, 1000);// calculate waiting time, from join time to leave time


        }
        // not in the queue
        else {
          this.myCurrentPosition = null;
        }

        this.currentQueueSize = Object.keys(res).length;
      } else {
        this.currentHelpQueue = null;
        this.myCurrentPosition = null;
        this.currentQueueSize = 0;
      }

    });
  }
  /**
   * if user is disconnect from the system
   */
  ngOnDestroy() {

    let id = this.appService.user.uid;
    let object = {};
    object[id] = 'disconnect';
    this.labRef.update(object);

  }
  /**
   * if user connect to data base
   */
  connect() {
    this.labRef = this.db.object(this.appService.LABS_LIST + this.lab + this.appService.ATTENDING_LIST);
    this.db.object(this.lab).valueChanges().subscribe(res => {
      this.labData = res;
    });
    let id = this.appService.user.uid;
    let object = {};
    object[id] = 'connect';
    object[id] = { connectedTime: Date.now() }
    this.labRef.update(object);
  }

  /**
   * get rating from html and upload to database
   * @param key api key
   * @param OBJ object
   */
  uploadRating(key, OBJ) {
    const queueHistoryRef = this.db.object(this.appService.LABS_LIST + this.lab + this.appService.QUEUE_HISTORY + this.appService.user.uid + '/' + key);
    queueHistoryRef.update(OBJ);
  }
  /**
   * join the queue button, counting time, and calculate waiting time
   */
  joinQueue() {
    const queueRef = this.db.object(this.appService.LABS_LIST + this.lab + this.appService.HELP_QUEUE);
    // let myCurrentPosition
    const object = {};
    const id = this.appService.user.uid;
    object[id] = { timestamp: Date.now() };
    this.myTimeStamp = object[id].timestamp;
    setInterval(() => {         // replaced function() by ()=>
      const myDate = Date.now();
      const oldData = this.myTimeStamp;

      this.waitingTime = Math.abs(myDate - oldData);
      this.waitingTime = this.convertMillisecondsToDigitalClock(this.waitingTime).clock;
    }, 1000);
    queueRef.update(object);
  }

  // https://stackoverflow.com/questions/13601737/how-to-convert-milliseconds-into-a-readable-date-minutesseconds-format
  // CONVERT MILLISECONDS TO DIGITAL CLOCK FORMAT
  convertMillisecondsToDigitalClock(ms) {
    const hours = Math.floor(ms / 3600000), // 1 Hour = 36000 Milliseconds
      minutes = Math.floor((ms % 3600000) / 60000), // 1 Minutes = 60000 Milliseconds
      seconds = Math.floor(((ms % 360000) % 60000) / 1000) // 1 Second = 1000 Milliseconds
    return {
      hours: hours,
      minutes: minutes,
      seconds: seconds,
      clock: hours + ':' + minutes + ':' + seconds
    };
  }
  helpStudent(id) {
    // let queueRef = this.db.object(this.lab + '/helpQueue/'+id);

  }
  /**
   * leave the queue and save data to database
   * @param student selected student
   */
  leaveQueue(student?: any) {
    if (typeof student !== 'undefined') {
      const queueRef = this.db.object(this.appService.LABS_LIST + this.lab + this.appService.HELP_QUEUE + student.key);

      // Save to the queue history
      const queueHistory = this.db.object(this.appService.LABS_LIST + this.lab + this.appService.QUEUE_HISTORY);
      const object = {};
      // object[student.timestamp] = { waitingTime: Date.now() - student.timestamp }
      queueHistory.update([1, 2, 3, 4, 5, 6]).then(ok => {
        console.log(ok);
      }).catch(error => {
        console.log(error);
      });
      queueRef.remove();
      this.myCurrentPosition = null;
    } else {
      const queueRef = this.db.object(this.appService.LABS_LIST + this.lab + this.appService.HELP_QUEUE + this.appService.user.uid);
      const queueHistory = this.db.object(this.appService.LABS_LIST + this.lab + this.appService.QUEUE_HISTORY + this.appService.user.uid);
      const object = {};
      // let key = Date.now();
      object[this.myTimeStamp] = { waitingTime: -1, helpedBy: this.appService.user.uid }; // queue data
      queueHistory.update(object); // save student queue data
      queueRef.remove(); // remove student from current queue
      this.myCurrentPosition = null;
    }
  }
}
