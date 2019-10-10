import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ProgressbarModule, PaginationModule, TooltipModule, ModalModule } from 'ngx-bootstrap';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { ColetaComponent } from './coleta/coleta.component';
import { LoginComponent } from './login/login.component';
import { ColetainjetadaComponent } from './coletainjetada/coletainjetada.component';
import { NavmenuComponent } from './navmenu/navmenu.component';
import { FilterPipe } from './pipes/filter.pipe';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './services/auth/token.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    ColetaComponent,
    LoginComponent,
    ColetainjetadaComponent,
    NavmenuComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
