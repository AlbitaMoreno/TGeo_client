import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';

// import { GoogleMapsModule } from '@angular/google-maps';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { GeocodingService } from './geocode.service';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent],
  imports: [
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: '',
      libraries: ['places'],
    }),
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    // GoogleMapsModule,
    HttpClientModule,
    CommonModule,
  ],
  providers: [GeocodingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
