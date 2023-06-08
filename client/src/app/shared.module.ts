import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconComponent } from './components/icon/icon.component';
import { StoreTextComponent } from './components/store-text/store-text.component';

const components = [StoreTextComponent, IconComponent];

@NgModule({
  declarations: components,
  exports: components,
  imports: [CommonModule],
})
export class SharedModule {}
