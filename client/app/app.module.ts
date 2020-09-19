import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatGridListModule,
  MatIconModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatListModule
} from '@angular/material';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LinkedinLinkComponent } from './linkedin-link/linkedin-link.component';
import { GithubLinkComponent } from './github-link/github-link.component';
import { FooterComponent } from './footer/footer.component';
import { HeroComponent } from './hero/hero.component';
import { HomeLinkComponent } from './home-link/home-link.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    LinkedinLinkComponent,
    GithubLinkComponent,
    FooterComponent,
    HeroComponent,
    HomeLinkComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatSnackBarModule,
    MatIconModule,
    MatGridListModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
