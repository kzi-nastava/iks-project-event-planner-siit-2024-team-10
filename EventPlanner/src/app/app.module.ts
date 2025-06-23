import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from './layout/layout.module';
import { OfferingModule } from './offering/offering.module';
import { WineModule } from './wine/wine.module';
import { EventModule } from './event/event.module';
import { NotificationModule } from './notification/notification.module';
import { ChatModule } from './chat/chat.module';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

// Forms Imports
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { CreateCategoryDialogComponent } from './offering/create-category-dialog/create-category-dialog.component';
import { CategoryDialogComponent } from './offering/category-dialog/category-dialog.component';
import { OfferingCategoryComponent } from './offering/offering-category/offering-category.component';

// Services
import { CategoryService } from './offering/category-service/category.service';
import { PricelistComponent } from './offering/pricelist/pricelist.component';
import {Interceptor} from './infrastructure/auth/interceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {UserModule} from './user/user.module';
import {ProductModule} from './product/product.module';

@NgModule({
  declarations: [
    AppComponent,
    CreateCategoryDialogComponent,
    CategoryDialogComponent,
    OfferingCategoryComponent,
    PricelistComponent,
  ],
  imports: [
    ChatModule,
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    WineModule,
    EventModule,
    OfferingModule,
    NotificationModule,
    ProductModule,
    UserModule,

    // Material Modules
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatSliderModule,
    MatDatepickerModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,

    // Animation and Forms
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    CategoryService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
