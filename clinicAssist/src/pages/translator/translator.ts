import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ToastOptions } from 'ionic-angular';
import { CompleteTestServiceProvider } from "../../providers/complete-test-service/complete-test-service";
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

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
	private doctorLanguage:string;
	private patientLanguage:string;
	private current_language:string;
	private activity_state:Boolean;
	private text_field_content:String;
	@ViewChild('myTextBox') searchbar: any;
	private toastOptions:ToastOptions;

	private conversation:String[] = [];

	constructor(public navCtrl: NavController, public navParams: NavParams,
	public completeTestService: CompleteTestServiceProvider, private toast:ToastController) {
		this.activity_state = false;
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad TranslatorPage');
	}

	setLocale(language_code:string) {
		console.log("Translated from " + this.current_language + " to " + language_code);
		this.current_language = language_code;
		this.completeTestService.setCurrentLanguage(language_code);
	}

	selectLanguage() {
		if (this.activity_state) {
			// reset activities

			// save the current conversation in the database
			/*
			*
			* code here for saving the conversation in the database
			*
			*/

			// clear the conversation list
			this.conversation = [];

			this.activity_state = false;
		}
		else {
			// start activities
			this.setLocale(this.doctorLanguage);
			this.completeTestService.setDoctorLanguage(this.doctorLanguage);
			this.completeTestService.setPatientLanguage(this.patientLanguage);

			this.activity_state = true;
		}
	}

	translate() {
		if (this.current_language == this.doctorLanguage) {
			this.setLocale(this.patientLanguage);
			
		}
		else if (this.current_language == this.patientLanguage) {
			this.setLocale(this.doctorLanguage);
		}
		else {
			console.log("[translate] ERROR: The current language is neither doctor's language nor patient's language");
			this.setLocale(this.doctorLanguage)
		}
	}

	sendMessage() {
		if (this.searchbar.keyword === this.text_field_content) {
			this.conversation.push(this.text_field_content);
		}
		else {
			console.log("[WARNING] The text in the box does not have predefined translations");
			this.toastOptions = {
				message: "Translations not available for this sentence",
				duration: 2000,
				showCloseButton: false
			};
			this.toast.create(this.toastOptions).present();
		}
	}

}
