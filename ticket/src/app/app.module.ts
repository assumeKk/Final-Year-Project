import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { StudentComponent } from './student/student.component';
import { TaComponent } from './ta/ta.component';
import { AppRoutingModule } from './/app-routing.module';
import { LabroomComponent } from './labroom/labroom.component';
import { AppService } from './app.service';
import { TaLoginComponent } from './ta-login/ta-login.component';
import { TaService } from './ta/ta.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WaitTimePipe } from './wait-time.pipe';
import { AdminComponent } from './admin/admin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { KeysPipe } from './keys.pipe';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { LabNamePipe } from './lab-name.pipe';
import { DatelabelComponent } from './datelabel/datelabel.component';
import { WeekPipe } from './week.pipe';
import { IdParserPipe } from './id-parser.pipe';
import { TaLabroomComponent } from './ta-labroom/ta-labroom.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    StudentComponent,
    TaComponent,
    LabroomComponent,
    TaLoginComponent,
    DashboardComponent,
    WaitTimePipe,
    AdminComponent,
    KeysPipe,
    LabNamePipe,
    DatelabelComponent,
    WeekPipe,
    IdParserPipe,
    TaLabroomComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    HttpModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularMultiSelectModule,
    AngularFireAuthModule, ReactiveFormsModule
  ],
  providers: [HttpModule, AppService, TaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
