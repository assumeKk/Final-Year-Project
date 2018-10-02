import { Component, OnInit, ViewEncapsulation, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService, USER_TYPE } from '../app.service';
import { TaService } from '../ta/ta.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {


  username: string;
  password: string;
  currentUserType = USER_TYPE.STUDENT;

  constructor(
    private appService: AppService,
    private router: Router,
  ) {
    if (localStorage.getItem('user')) {
      this.appService.user = JSON.parse(localStorage.getItem('user'));
      this.router.navigate(["/dashboard"]);

    }
  }

  /**
   * login() from appService.ts, check username and password
   */
  login() {
    this.appService.login(this.username, this.password);

  }

  loginAsTa() {
    // this.appService.login(this.username);
    this.router.navigate(["/ta"]);
  }


  ngOnInit() {
  }



}
