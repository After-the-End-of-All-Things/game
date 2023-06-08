import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreTextComponent } from './components/store-text/store-text.component';

const components = [
  StoreTextComponent
];

@NgModule({
  declarations: components,
  exports: components,
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
