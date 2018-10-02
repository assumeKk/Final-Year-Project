import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppService } from '../app.service';

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StudentComponent implements OnInit {
  public studentName: string;
  public labs: any = [];

  public currentSelectedLab = null;

  constructor(
    private appService: AppService,
    private db: AngularFireDatabase,
    private auth: AngularFireAuth,

  ) {
    // this.studentName = this.appService.user.username;
    // this.labs = this.appService.user.assigned_labs;
  }

  login() {

  }

  ngOnInit() {
    let user = this.auth.auth.currentUser;
    let id = this.appService.user.uid;

    this.db.object('users/' + id).valueChanges().subscribe(res => {
      this.labs = res['labList'];
    });
  }

  selectLab(lab) {
    this.currentSelectedLab = lab;
  }

}
