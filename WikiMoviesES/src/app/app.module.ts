import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSliderModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MovieCardComponent } from './components/movie-card/movie-card.component';
import {AppService} from './services/app.service';
import {HttpClientModule} from '@angular/common/http';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import {RouterModule} from '@angular/router';
import {appRoutes} from './app.routes';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import {Ng5SliderModule} from 'ng5-slider';
import {SanitizeHtmlPipe} from './pipes/sanitize-Html';

@NgModule({
  declarations: [
    AppComponent,
    MovieCardComponent,
    MovieDetailsComponent,
    AppLayoutComponent,
    SanitizeHtmlPipe
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    MatSliderModule,
    Ng5SliderModule,
    MatSelectModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
