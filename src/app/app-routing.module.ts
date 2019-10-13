import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ColetaComponent } from './coleta/coleta.component';
import { LoginComponent } from './login/login.component';
import { ColetainjetadaComponent } from './coletainjetada/coletainjetada.component';
import { RepresentantesLookupComponent } from './representantes-lookup/representantes-lookup.component';

const routes: Routes = [
  { path: 'coleta', component: ColetaComponent },
  { path: 'login', component: LoginComponent },
  { path: 'represlookup', component: RepresentantesLookupComponent },
  { path: 'coletainject', component: ColetainjetadaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
