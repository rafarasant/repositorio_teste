import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
// import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { ListPageRoutingModule } from './list-routing.module';
import { ListPage } from './list.page';
import { InputListComponent } from './input-list/input-list.component';
import { IonicStorageModule } from '@ionic/storage-angular';
import {StorageService} from '../ionic-storage.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListPageRoutingModule,
    // BrowserModule,
    ReactiveFormsModule,
    IonicStorageModule.forRoot()
  ],
  declarations: [
    ListPage, InputListComponent],
  providers: [
    StorageService,
  ]
})
export class ListPageModule {}
