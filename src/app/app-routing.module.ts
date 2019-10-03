import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ColetaComponent } from './coleta/coleta.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'coleta', component: ColetaComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
