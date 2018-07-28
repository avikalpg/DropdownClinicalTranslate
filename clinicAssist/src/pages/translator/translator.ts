import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TranslatorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-translator',
  templateUrl: 'translator.html',
})
export class TranslatorPage {

	private textView_doctorLanguage = "Doctor's Language"
	private textView_patientLanguage = "Patient's Language"
	private doctorLanguage:String = "English";
	private patientLanguage:String = "Hindi";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TranslatorPage');
  }

}
