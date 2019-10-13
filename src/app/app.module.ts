import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule , FormsModule, FormBuilder } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ProgressbarModule
  , PaginationModule
  , TooltipModule
  , ModalModule
  , AlertModule
  , AlertConfig
  // , BsDropdownModule
} from 'ngx-bootstrap';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

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
import { GridComponent } from './grid/grid.component';


@NgModule({
  declarations: [
    AppComponent,
    ColetaComponent,
    LoginComponent,
    ColetainjetadaComponent,
    NavmenuComponent,
    FilterPipe,
    RepresentantesLookupComponent,
    GridComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,

    // BsDropdownModule.forRoot(),

    AlertModule,
    ModalModule.forRoot(),
    AngularFontAwesomeModule,
    ProgressbarModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot()
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
