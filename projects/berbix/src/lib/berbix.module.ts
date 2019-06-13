import { NgModule } from '@angular/core';
import { BerbixComponent } from './berbix.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [BerbixComponent],
  imports: [
    CommonModule,
  ],
  exports: [BerbixComponent]
})
export class BerbixModule { }
