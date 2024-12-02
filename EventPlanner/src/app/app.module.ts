import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { LayoutModule } from './layout/layout.module';
import { OfferingModule } from './offering/offering.module';
import { WineModule } from './wine/wine.module';
import { MatButtonModule } from '@angular/material/button';
import { EventModule } from './event/event.module';
import { CreateCategoryDialogComponent } from './offering/create-category-dialog/create-category-dialog.component';
import { MatIconModule } from '@angular/material/icon'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { ReactiveFormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { NotificationModule } from './notification/notification.module';

@NgModule({
  declarations: [
    AppComponent,
    CreateCategoryDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    WineModule,
    MatButtonModule,
    EventModule,
    OfferingModule,
    MatIconModule, 
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatSliderModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    NotificationModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
