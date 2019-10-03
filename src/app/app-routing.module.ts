import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ColetaComponent } from './coleta/coleta.component';

const routes: Routes = [
  { path: 'coleta', component: ColetaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
