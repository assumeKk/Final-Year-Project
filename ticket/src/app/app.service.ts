import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';


import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';


export enum API_CALL {
  UPDATE_USER = 1,
  CREATE_USER = 2,
  DELETE_USER = 3,

  UPDATE_LAB = 4,
  CREATE_LAB = 5,
  DELETE_LAB = 6,


  UPDATE_LABROOM = 7,
  CREATE_LABROOM = 8,
  DELETE_LABROOM = 9,

  EDIT_LABROOM = 10,

  EDIT_LAB = 11,
}


@Injectable()
export class AppService implements CanActivate {


  //////// END POINT CONFIGURATION 

  public USERS = 'users';
  public SEMESTERS = 'semesters';
  public LABS = 'labs';

  public LABS_LIST = 'labs/list/';
  public LAB_ROOMLIST = 'labs/roomlist';

  public SEMESTER_LIST = 'semesters/list';

  public HELP_QUEUE = '/days/' + this.yyyymmdd() + '/helpQueue/';
  public QUEUE_HISTORY = '/days/' + this.yyyymmdd() + '/queueHistory/';

  public ATTENDING_LIST = '/days/' + this.yyyymmdd() + '/attendingList/';

  // public SLOTS = 'slot';
  public user: any;
  public title = 'Welcome to Lab Queuing System v0.01';
  public lab;
  constructor(
    private router: Router,
    private db: AngularFireDatabase,

    private auth: AngularFireAuth,
  ) {

  }

  //ref: https://codereview.stackexchange.com/questions/184459/best-way-to-get-date-on-yyyymmdd-format
  //change date format
  yyyymmdd() {
    var x = new Date();
    var y = x.getFullYear().toString();
    var m = (x.getMonth() + 1).toString();
    var d = x.getDate().toString();
    (d.length == 1) && (d = '0' + d);
    (m.length == 1) && (m = '0' + m);
    var yyyymmdd = y + m + d;
    return yyyymmdd;
  }
  /**
   * sign out
   */
  logout() {
    this.auth.auth.signOut()
      .then((res) => {
        this.router.navigate(["/login"]);
        this.loggout();
      }).catch(function (error) {
        console.log(error);
      });
  }

  /**
   * 
   * @param email sign new user to firebase, so they can login
   * @param password 
   */
  signup(email, password) {
    return this.auth.auth.createUserWithEmailAndPassword(email, password);
  }
  login(username, password) {
    this.auth.auth.signInWithEmailAndPassword(username, password)
      .then((user) => {
        console.log(user);
        this.user = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        }

        this.getRole();


        this.router.navigate(["/dashboard"]);
      }).catch(function (error) {
        console.log(error);
      });
  }

  storeLoginLocally(user) {
    localStorage.setItem('user', JSON.stringify(user));
    // console.log(localStorage.getItem('user'));
  }

  loggout() {
    localStorage.removeItem('user');//sign out
  }
  /**
   * get user role, check property of user in databse.
   */
  getRole() {
    let ref = this.db.object('users/' + this.user.uid).valueChanges().subscribe(res => {
      this.user.role = res['role'];
      this.user.displayName = "";
      this.user.displayName = res['displayName'];
      this.title = 'Hello, ' + this.user.displayName + " !" + this.title;

      this.storeLoginLocally(this.user);//save login data local
    });
  }
  isStudent() {
    // this.auth.
  }


  joinLab(lab) {
    this.router.navigate(['lab', lab]);
  }
  canActivate(): boolean {

    if (typeof this.user === "undefined") {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }


  private labRooms = [];
  private Ta: TA;

  createRoom(room: LabRoom) {
    this.labRooms.push(room);
  }


  getTaName() {
    return this.Ta.name;
  }

  getRooms() {
    return this.labRooms;
  }


  /////////////// 
  getLabName(id) {
    return this.db.object('labs/list/' + id).valueChanges();
  }

  getLabroomName(id) {
    return this.db.object('labs/roomlist/' + id).valueChanges();
  }

  getStudent(id) {
    return this.db.object('users/' + id).valueChanges();
  }

  getCurrentLiveLab(id) {
    return this.db.object('lab/list/slots' + id).valueChanges();
  }
}

export interface User {
  username: string;
  usertype: USER_TYPE;
  assigned_labs?: any;
  firstname?: string;
  lastname?: string;
}


export enum USER_TYPE {
  STUDENT = 1,

  TA = 2,
  ADMIN = 3,
}

export interface LabRoom {
  name: string;
  studentList: any;
}


export interface TA {
  name: string;

}
