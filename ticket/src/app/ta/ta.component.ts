import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppService } from '../app.service';
import { TaService } from './ta.service';

import { filter } from 'rxjs/operators';
import { from } from 'rxjs/observable/from';

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';


@Component({
  selector: 'app-ta',
  templateUrl: './ta.component.html',
  styleUrls: ['./ta.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TaComponent implements OnInit {
  public TAName: string;


  // temp variable, get this variable from backend in future.
  public labRooms: any;

  public currentLiveLabRooms: any;
  public currentLiveLabRoomsRef: any;




  public labs: any = [];

  public lab$;
  public labRef$;


  constructor(
    private appService: AppService,
    private db: AngularFireDatabase,
    private auth: AngularFireAuth,

  ) {
    // this.studentName = this.appService.user.username;
    // this.labs = this.appService.user.assigned_labs;
  }

  ngOnInit() {
    let user = this.auth.auth.currentUser;
    let id = this.appService.user.uid;
    this.db.object('users/' + id).valueChanges().subscribe(res => {
      this.labs = res['labList'];
    });

  }
  // 以后用，记得加
  login() {

  }

}
