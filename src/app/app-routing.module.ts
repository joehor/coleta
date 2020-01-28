import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ColetaComponent } from './coleta/coleta.component';
import { LoginComponent } from './login/login.component';
import { ColetainjetadaComponent } from './coletainjetada/coletainjetada.component';
import { RepresentantesLookupComponent } from './representantes-lookup/representantes-lookup.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TestesComponent } from './testes/testes.component';
import { DespesasComponent } from './despesas/despesas.component';
import { DespesaFrmComponent } from './despesa-frm/despesa-frm.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'testes', component: TestesComponent },
  { path: 'coleta', component: ColetaComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'represlookup', component: RepresentantesLookupComponent },
  { path: 'coletainject', component: ColetainjetadaComponent },
  { path: 'despesalst', component: DespesasComponent},
  { path: 'despesafrm', component: DespesaFrmComponent},
  { path: 'despesafrm/:id', component: DespesaFrmComponent},
  { path: 'despesafrm/:id/delete', component: DespesaFrmComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
