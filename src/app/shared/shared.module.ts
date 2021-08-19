import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ToastModule } from './toast/toast.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ToastModule
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    ToastModule
  ]
})
export class SharedModule { }
