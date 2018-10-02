import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { StudentComponent } from './student/student.component';
import { LabroomComponent } from './labroom/labroom.component';
import { TaLoginComponent } from './ta-login/ta-login.component';
import { TaComponent } from './ta/ta.component';
import { AppService } from './app.service';
import { DashboardComponent } from './dashboard/dashboard.component';
// 添加labroom1-ta

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AppService] },
  { path: 'lab', component: LabroomComponent, canActivate: [AppService] },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
