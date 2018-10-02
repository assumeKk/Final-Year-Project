import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    public appService: AppService
  ) { }

  ngOnInit() {

  }
  /**
   * check role and return correct content
   * @param role role of the user, 1 = student, 2 = TA, 3 admin
   */
  canActivate(role) {
    return this.appService.user.role == role.toString();
  }

}
