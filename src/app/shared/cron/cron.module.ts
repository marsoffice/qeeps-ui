import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CronComponent } from './cron/cron.component';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    CronComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FlexLayoutModule,
    MatSelectModule
  ],
  exports: [
    CronComponent
  ]
})
export class CronModule { }
