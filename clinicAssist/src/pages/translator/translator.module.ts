import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslatorPage } from './translator';

@NgModule({
  declarations: [
    TranslatorPage,
  ],
  imports: [
    IonicPageModule.forChild(TranslatorPage),
  ],
})
export class TranslatorPageModule {}
