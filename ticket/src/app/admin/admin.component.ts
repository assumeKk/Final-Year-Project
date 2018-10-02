import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AppService, API_CALL } from '../app.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
//import { keyframes } from '../../../node_modules1/@angular/animations/public_api';
import { NgbTabsetConfig } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [NgbTabsetConfig] // add NgbTabsetConfig to the component providers

})
export class AdminComponent implements OnInit {
  public userRef;
  public labRef;
  public labList$;
  public labListRef$;
  public currentEditingLabId;
  public currentEditingUserId;
  public currentEditingLabroomId;
  public labRoomRef;
  public userList: any;
  public labRoomList: Observable<any[]>;
  public labList: Observable<any[]>;
  public semesterList: Observable<any[]>;
  public userListSize;
  public userForm: FormGroup;
  public labForm: FormGroup;
  public labRoomForm: FormGroup;
  public semesterForm: FormGroup;
  public API_CALL;
  public reportSummaryRef;
  public totalStudent;
  public currentOrientation = 'vertical';
  public dateObj = [];
  public newUserList;
  public slotDateObj = {
    week: null, startingTime: null, endingTime: null
  }
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  public jsonFile;
  public labRoomsFile;
  public labsFile;
  /**
   * subcribe to data base to retrieve data
   * @param appService  ref to appservice.ts
   * @param db  ref to firebase
   * @param auth 
   * @param config set up basic config for admin page
   */
  constructor(
    private appService: AppService,
    private db: AngularFireDatabase,
    private auth: AngularFireAuth,
    config: NgbTabsetConfig,
    // public http: HttpClient,

  ) {
    // Hours from 9am to 12am
    config.orientation = 'vertical';
    this.API_CALL = API_CALL;
    this.dateObj.push({ value: 0, name: 9 });
    this.dateObj.push({ value: 1, name: 10 });
    this.dateObj.push({ value: 2, name: 11 });
    this.dateObj.push({ value: 3, name: 12 });
    this.dateObj.push({ value: 4, name: 13 });
    this.dateObj.push({ value: 5, name: 14 });
    this.dateObj.push({ value: 6, name: 15 });
    this.dateObj.push({ value: 7, name: 16 });
    this.dateObj.push({ value: 8, name: 17 });
    this.dateObj.push({ value: 9, name: 18 });
    this.dateObj.push({ value: 10, name: 19 });
    this.dateObj.push({ value: 11, name: 20 });
    this.dateObj.push({ value: 12, name: 21 });
    this.dateObj.push({ value: 13, name: 22 });
    this.dateObj.push({ value: 14, name: 23 });
    this.dateObj.push({ value: 15, name: 24 });
    //subscribe to database to get data from list
    db.object('users').valueChanges().subscribe(res => {
      if (res) {
        this.userRef = res;
      }
    });

    // this.labRef = db.list('labs/list').valueChanges();
    db.object('labs/list').valueChanges().subscribe(res => {
      this.labRef = res;
    });

    this.userList = db.object<User>('users').valueChanges();
    this.userList.subscribe(res => {
      this.userListSize = Object.keys(res).length;
    })

    this.labListRef$ = db.list('labs/list');
    this.labList$ = this.labListRef$.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    })

    db.object('labs/roomlist').valueChanges().subscribe(res => {
      if (res) {
        this.labRoomRef = res;
      }
    });

    db.object('labs/list').valueChanges().subscribe(res => {
      if (res) {

        this.dropdownList = [];
        for (let key of Object.keys(res)) {
          this.dropdownList.push({ id: key, itemName: res[key].name });
        }
      }

    });


    this.dropdownSettings = {
      singleSelection: false,
      text: "Select labs",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "myclass custom-class"
    };

    db.object('labs/list').valueChanges().subscribe(res => {
      if (res) {
        this.reportSummaryRef = res;
        console.log(this.reportSummaryRef);
      }
    });

  }


  /**
   * initial forms when admin page is load
   */
  ngOnInit() {
    this.initUserForm();
    this.initLabForm();
    this.initLabRoomForm();
    this.initSemesterForm();
    let tabcontent = document.getElementsByClassName("tabcontent");
    tabcontent[0]['style'].display = "block";
  }
  /**
   * upload list of users, not implemented yet
   */
  uploadUsers() {
    console.log('Not implemented yet ');
  }
  /**
   * upload list of labs, not implemented yet
   */
  uploadLabs() {
    let labRef = this.db.list('/labs/list');
    for (let obj of this.labsFile['Labs']) {
      labRef.push(obj);
    }
  }
  /**
   * upload list of labrooms, not implement test
   */

  uploadLabRooms() {
    let labRoomsRef = this.db.list('/labs/roomlist');
    for (let obj of this.labRoomsFile['Labrooms']) {
      labRoomsRef.push(obj);
    }
  }
  /**
   * Open form tab when user click on the button
   * @param evt event, click to open
   * @param id html element id
   */
  openTab(evt, id) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("btn btn-outline-dark btn-block tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(id).style.display = "block";
    evt.currentTarget.className += " active";
  }
  /**
   * add lab session slots, click add slot button to add slot to lab.
   */
  addSlot() {
    console.log(this.slotDateObj);

    if (this.labForm.value['slots'] == "") {
      this.labForm.value['slots'] = [];
    }
    if (this.labForm.value['room'] == "") {
      this.labForm.value['slots'].push({
        weekday: this.labForm.value['weekDay'],
        startHour: this.labForm.value['startHour'],
        endHour: this.labForm.value['endHour'],
        room: this.labForm.value['defaultRoom'],
      });
    } else {
      this.labForm.value['slots'].push({
        weekday: this.labForm.value['weekDay'],
        startHour: this.labForm.value['startHour'],
        endHour: this.labForm.value['endHour'],
        room: this.labForm.value['room'],
      });
    }


  }

  initLabRoomForm() {
    this.labRoomForm = new FormGroup({
      name: new FormControl('', Validators.required),
    });
  }
  /**
   * Initialize html forms
   */
  initLabForm() {
    this.labForm = new FormGroup({
      id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      defaultRoom: new FormControl('', Validators.required),
      room: new FormControl('', Validators.required),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      weekDay: new FormControl('', Validators.required),
      startHour: new FormControl('', Validators.required),
      endHour: new FormControl('', Validators.required),
      slots: new FormControl([], Validators.required),
    });
  }

  initSemesterForm() {
    this.semesterForm = new FormGroup({
      name: new FormControl('', Validators.required),
      role: new FormControl('', Validators.required),
    });
  }
  initUserForm() {
    this.userForm = new FormGroup({

      displayName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      role: new FormControl('', Validators.required),
      labList: new FormControl([], Validators.required),
    });
  }
  /**
   * upload files to firebase as json type.
   * @param files 
   * @param type 
   */
  uploadFile(files: FileList, type) {
    this.jsonFile = files.item(0);
    console.log('123');
    console.log(this.jsonFile);
    console.log(files);

    let reader: FileReader = new FileReader();
    reader.readAsText(this.jsonFile);
    reader.onload = () => {
      // console.log(reader.result);
      let varRef = JSON.parse(reader.result);

      if (type == "labs") {
        this.labsFile = varRef;
      }

      if (type == "labrooms") {
        this.labRoomsFile = varRef;

      }

      if (type == "users") {
        this.newUserList = varRef;
      }
    };
    // console.log(reader);
  }

  /**
   * update object data in firebase
   * @param CALL call to api
   * @param KEY  object key
   * @param OBJ  object
   */
  updateObject(CALL, KEY, OBJ?) {

    switch (CALL) {
      case API_CALL.UPDATE_USER://update users
        let temp = Object.assign([], this.userForm.value['labList']); //get value from html element
        this.userForm.value['labList'] = [];

        for (let lab of temp) {
          this.userForm.value['labList'].push(lab.id);//push id to lablist array
        }

        for (let lab of this.userForm.value['labList']) { //create object from items in lab list
          var object = {};
          let key = this.currentEditingUserId;
          object[key] = {
            enrolledTime: Date.now()
          };
          this.db.object('/labs/list/' + lab + '/studentList').update(object); //update database
        }

        this.db.object('/users/' + this.currentEditingUserId).update(OBJ).then(ok => { });
        break;
      case API_CALL.DELETE_USER: //remove user from database
        this.db.object('/users/' + KEY).remove().then(ok => { });
        break;
      case API_CALL.DELETE_LAB: //remove lab from database
        this.db.object('/labs/list/' + KEY).remove().then(ok => { });
        break;
      case API_CALL.UPDATE_LAB://update lab

        this.labListRef$.update(this.currentEditingLabId, OBJ);
        break;
      case API_CALL.EDIT_LAB://edit lab in databse

        this.labForm.reset();

        this.labForm.patchValue(OBJ);
        if (!this.labForm.value['slots']) {
          this.labForm.value['slots'] = [];
        }
        this.currentEditingLabId = KEY;
        break;
      case API_CALL.DELETE_LABROOM:
        this.db.object('/labs/roomlist/' + KEY).remove().then(ok => { });
        break;
      case API_CALL.EDIT_LABROOM:
        this.labRoomForm.patchValue(OBJ);
        this.currentEditingLabroomId = KEY;
        break;
      case API_CALL.UPDATE_LABROOM:
        this.db.object('/labs/roomlist/' + this.currentEditingLabroomId).update(OBJ).then(ok => { });

        break;
      default:
        console.log('Default');
        break;
    }
  };


  importJson() {
    // import date
    // this.http.get("../../assets/menu/menu.json").map(res => res['Menu']); 

    // for(let user of jsonData){

    // }
  }
  /**
   * create new user
   */
  createUser() {
    let temp = Object.assign([], this.userForm.value['labList']);// get data from form
    this.userForm.value['labList'] = [];
    for (let lab of temp) {
      this.userForm.value['labList'].push(lab.id);
    }


    this.appService.signup(this.userForm.value['email'], '123456').then(user => {//add user detail to database
      let userObj = {
        role: this.userForm.value['role'],
        email: user.email,
        displayName: this.userForm.value['displayName'],
        labList: this.userForm.value['labList'],
      };

      var object = {};
      let key = user.uid;
      object[key] = userObj;

      this.db.object('/users').update(object).then(ok => {
        this.userForm.reset();
      });


      for (let lab of this.userForm.value['labList']) {
        var object = {};
        let key = user.uid;
        object[key] = {
          enrolledTime: Date.now()
        };
        this.db.object('/labs/list/' + lab + '/studentList').update(object);//update object
      }

    }).catch(error => {//if error occured, print error on console
      console.log('Error');
      console.log(error);
    });

  }
  /**
   * remove the lab slot
   * @param index selected html value
   */
  remove(index) {
    this.labForm.value['slots'].splice(index, 1);
  }
  /**
   * set value lab
   * @param key api key
   * @param lab lab session
   */
  editLab(key, lab) {
    console.log(key, lab);
    this.labForm.patchValue(lab);
    console.log(this.labForm.value);
  }
  /**
   * edit selected user for update
   * @param key api key
   * @param user selected user
   */
  editUser(key, user) {
    this.userForm.reset();
    let tempLabList = Object.assign({}, user);
    this.currentEditingUserId = key;
    tempLabList['labList'] = [];
    this.userForm.patchValue(tempLabList);
    if (user['labList']) {
      for (let key of user['labList']) {
        //console.log("view key: " + key);
        let result = this.dropdownList.filter(item =>
          item['id'] == key.toString()
        );
        if (result.length > 0) {
          this.userForm.value['labList'].push(result[0]);
        }
      }
    }
  }
  /**
   * create new lab room and save in database
   */
  createLabRoom() {
    var object = Object.assign({}, this.labRoomForm.value);
    // var object[]
    object['slot'] = [];
    for (let obj of this.dateObj) {
      let key = obj.value;
      object['slot'].push({ occupied: false, name: obj.name });
    }
    // console.log(object);
    this.db.list<User>('labs/roomlist').push(object);
  }
  /**
   * create new lab session and save in databse
   */
  createLab() {

    this.db.list('labs/list').push(this.labForm.value);
  }
  /**
   * add lab session to lab room
   * @param room lab room
   */
  addLab(room) {

    if (room && !this.checkDuplicate(room, this.userForm.value['labList'])) {
      this.userForm.value['labList'].push(room);
    }
  }

  onItemSelect(item: any) {
    console.log(item);
    item = item.id;
    console.log(item);
    // console.log(this.selectedItems);
  }
  /**
   * check repeated lab sessions
   * @param value 
   * @param array 
   */
  checkDuplicate(value, array) {
    let res = false;
    array.forEach(element => {
      if (element.toString() == value.toString()) {
        return res = true;
      }
    });
    return res;
  }
}
