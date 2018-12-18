import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ToastOptions } from 'ionic-angular';
import { CompleteTestServiceProvider } from "../../providers/complete-test-service/complete-test-service";
import { DatabaseProvider } from '../../providers/database/database';


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

	private doctorLanguageLabel = "Doctor's Language"
	private patientLanguageLabel = "Patient's Language"
	private doctorLanguage:string;
	private patientLanguage:string;
	private current_language:string;
	private target_language:string;
	private activity_state:Boolean;
	private text_field_content:String;
	@ViewChild('myTextBox') searchbar: any;
	private toastOptions:ToastOptions;

	private conversation = [];
	private response_encoding = {};

	constructor(public navCtrl: NavController, public navParams: NavParams,
	public completeTestService: CompleteTestServiceProvider, private toast:ToastController, public dbms: DatabaseProvider) {
		this.activity_state = false;
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad TranslatorPage');
	}

	setLocale(language_code:string) {
		console.log("Translated from " + this.current_language + " to " + language_code);
		this.current_language = language_code;
		if (this.current_language == this.doctorLanguage) {
			this.target_language = this.patientLanguage;
		}
		else if (this.current_language == this.patientLanguage) {
			this.target_language = this.doctorLanguage;
		}
		else {
			// This does not make any difference; I have still put it just-in-case
			this.target_language = this.patientLanguage;
		}
		// this.completeTestService.setDatabaseMode(false);
		this.completeTestService.setDatabaseMode(true);
		this.completeTestService.setShowMeaningIdInResults(false);
		this.dbms.showSentencesOfLanguage(language_code);
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
			if ((this.doctorLanguage) && (this.patientLanguage)){
				// start activities
				this.setLocale(this.doctorLanguage);
				this.completeTestService.setDoctorLanguage(this.doctorLanguage);
				this.completeTestService.setPatientLanguage(this.patientLanguage);

				this.activity_state = true;
			}
			else {
				alert("Please select the languages first");
			}
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

		// Clear the text after translation
		this.searchbar.keyword = "";
	}

	findBestTranslation(all_translations:Object[]) {
		// Implementing a very basic version of this function for now
		// TODO: Enhance this function to make it smart
		return all_translations[0];
	}

	sendMessage() {
		if (this.searchbar.keyword === this.text_field_content) {
			// Assimilating the sentence
			this.dbms.getSentenceDetailsFromDB(this.text_field_content).then((sentence_details) => {
				this.response_encoding = {};
				this.response_encoding['created'] = Date.now();
				this.response_encoding['sender_is_left'] = (this.current_language == this.doctorLanguage);
				let current_side = (this.response_encoding['sender_is_left']) ? "left" : "right";
				this.response_encoding['meaning_id'] = sentence_details['meaning_id'];
				this.response_encoding[current_side] = sentence_details['id'];
				this.response_encoding[current_side + "_text"] = sentence_details['sentence'];
				
				this.dbms.getSentencesFromMeaning(this.response_encoding['meaning_id'], this.target_language).then((all_translations) => {
					if ((all_translations != false) && (all_translations != true)) {
						let target_side = (this.response_encoding['sender_is_left']) ? "right" : "left";
						this.response_encoding[target_side + "_all"] = all_translations;
						let best_translation = this.findBestTranslation(all_translations);
						this.response_encoding[target_side] = 	best_translation['id'];
						this.response_encoding[target_side + "_text"] = best_translation['sentence'];

						// This push is here so that we don't add sentences without translations
						this.conversation.push(this.response_encoding);
					}
					else {
						console.log("Could not find translations for this sentence: " + this.response_encoding[this.current_language + "_text"]);
						alert("Missing translations! Please choose a different sentence");
					}
				})
			})

			// Clear the text after sending message
			this.searchbar.keyword = "";
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
