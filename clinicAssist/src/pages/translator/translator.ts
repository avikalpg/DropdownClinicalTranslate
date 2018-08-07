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
	private current_language:String;
	private activity_state:Boolean;

	static doctor_response_list:String[] = [
		"How are you feeling today?",
        "How old are you?",
        "Since when do you have this problem?",
        "Please gesture towards the point where you feel the pain.",
        "What kind of pain are you experiencing?",
        "Do you have any allergies?",
        "Open your mouth.",
        "Stick your tongue out.",
        "I am prescribing some medicines.",
        "Take this pill with water after eating.",
        "Drink more water",
        "Come back again next week for a follow-up.",
        "Don't worry, you will get well very soon."
	];

	static patient_response_list:String[] = [
		"Headache",
        "Stomachache",
        "Injury",
        "Cold",
        "Fever",
        "Behind the eyes",
        "On the top of the head",
        "On the backside of the head",
        "Forehead",
        "Temples",
        "Stabbing pain",
        "Burning pain",
        "Throbbing"
	];

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.activity_state = false;
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad TranslatorPage');
	}

	private static stringMatchLogic(keyword:String, option:String) {
		return option.toLowerCase().includes(keyword.toLowerCase())
	}

	getResponses(keyword:String) {
		if (this.current_language == this.doctorLanguage) {
			return TranslatorPage.doctor_response_list.filter(item => TranslatorPage.stringMatchLogic(keyword, item));
		}
		else if (this.current_language == this.patientLanguage) {
			return TranslatorPage.patient_response_list.filter(item => TranslatorPage.stringMatchLogic(keyword, item));
		}
		else {
			console.log("[getResponses] ERROR: The current language is neither doctor's language nor patient's language");
		}
	}

	setLocale(language_code:String) {
		console.log("Translated from " + this.current_language + " to " + language_code);
		this.current_language = language_code;
	}

	selectLanguage() {
		if (this.activity_state) {
			// reset activities

			this.activity_state = false;
		}
		else {
			// start activities
			this.setLocale(this.doctorLanguage)

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

}
