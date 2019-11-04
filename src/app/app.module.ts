import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule , FormsModule, FormBuilder } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// ngx-bootstrap...
import { ProgressbarModule
  , PaginationModule
  , TooltipModule
  , ModalModule
  , AlertModule
  , AlertConfig
  , BsDropdownModule
  , BsDropdownDirective
  , BsDropdownConfig
  , CarouselModule
  , TabsModule
  , TypeaheadModule
} from 'ngx-bootstrap';

import { ToastrModule } from 'ngx-toastr';

import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { ColetaComponent } from './coleta/coleta.component';
import { LoginComponent } from './login/login.component';
import { ColetainjetadaComponent } from './coletainjetada/coletainjetada.component';
import { NavmenuComponent } from './navmenu/navmenu.component';
import { FilterPipe } from './pipes/filter.pipe';

import { HTTP_INTERCEPTORS, HttpClientModule, HttpParams, HttpRequest, HttpHandler, HttpEvent  } from '@angular/common/http';
import { TokenInterceptor } from './services/auth/token.interceptor';
import { AuthService } from './services/auth/auth.service';
import { RepresentantesLookupComponent } from './representantes-lookup/representantes-lookup.component';
import { GridComponent } from './componentes/grid/grid.component';
import { LoadingComponent } from './loading/loading.component';
import { AlertComponent } from './componentes/alert/alert.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LayoutComponent } from './layout/layout.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { FooterComponent } from './footer/footer.component';
import { GaugeComponent } from './componentes/gauge/gauge.component';
import { DespesasComponent } from './despesas/despesas.component';
import { InputLookupComponent } from './componentes/input-lookup/input-lookup.component';
import { ModalGridLookupComponent } from './componentes/modal-grid-lookup/modal-grid-lookup.component';


@NgModule({
  declarations: [
    AppComponent,
    ColetaComponent,
    LoginComponent,
    ColetainjetadaComponent,
    NavmenuComponent,
    FilterPipe,
    RepresentantesLookupComponent,
    GridComponent,
    LoadingComponent,
    AlertComponent,
    HomeComponent,
    PageNotFoundComponent,
    SidebarComponent,
    LayoutComponent,
    ToolbarComponent,
    FooterComponent,
    GaugeComponent,
    DespesasComponent,
    InputLookupComponent,
    ModalGridLookupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,

    AngularFontAwesomeModule,

    // ngx-bootstrap...
    AlertModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    CarouselModule.forRoot(),
    TabsModule.forRoot(),
    TypeaheadModule.forRoot(),

    // ngx-bootstrap - toast
    ToastrModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    AuthService,
    FormBuilder,
    AlertConfig,
    HttpParams,
    BsDropdownDirective,
    BsDropdownConfig
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
