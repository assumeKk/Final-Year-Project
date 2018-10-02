import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AppService } from '../app.service';

@Component({
  selector: 'app-ta-labroom',
  templateUrl: './ta-labroom.component.html',
  styleUrls: ['./ta-labroom.component.css']
})


export class TaLabroomComponent implements OnInit {
  @Input() lab;
  public labroom$;
  public labroomRef$;

  public helpQueueRef;
  public helpQueue

  public labObject;

  constructor(
    private db: AngularFireDatabase,
    private appService: AppService,
  ) { }

  /**
   * default get lab session, get timestamp of student, get student object
   */
  ngOnInit() {
    this.helpQueueRef = this.db.list('labs/list/' + this.lab + this.appService.HELP_QUEUE, ref =>
      ref.orderByChild('timestamp'));

    this.helpQueue = this.helpQueueRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    })

    this.db.object('labs/list/' + this.lab).valueChanges().subscribe(res => {
      this.labObject = res;
    });
  }

  /**
   * remove student
   * @param student selected student
   */
  removeStudent(student) {
    let queueRef = this.db.object('labs/list/' + this.lab + this.appService.HELP_QUEUE + student.key);

    // Save to the queue history
    let queueHistory = this.db.object('labs/list/' + this.lab + this.appService.QUEUE_HISTORY + student.key);
    var object = {};
    object[student.timestamp] = { waitingTime: Date.now() - student.timestamp, helpedBy: this.appService.user.uid }
    queueHistory.update(object);
    queueRef.remove();
  }
}
