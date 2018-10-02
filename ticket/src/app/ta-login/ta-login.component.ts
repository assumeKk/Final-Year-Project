import { Component, OnInit, ViewEncapsulation,  } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { AppService } from '../app.service';

@Component({
  selector: 'app-ta-login',
  templateUrl: './ta-login.component.html',
  styleUrls: ['./ta-login.component.css']
})
export class TaLoginComponent implements OnInit {
  username:string;
  password:string;
  
  constructor(private appService:AppService) { }
  login(){
    console.log("login");
  }
  ngOnInit() {
  }

}
