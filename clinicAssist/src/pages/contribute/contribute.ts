import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CompleteTestServiceProvider } from "../../providers/complete-test-service/complete-test-service";
import { DatabaseProvider } from '../../providers/database/database';

/**
 * Generated class for the ContributePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-contribute',
	templateUrl: 'contribute.html',
})
export class ContributePage {

	private new_sentence = {};
	private translation = {};
	private translated_sentence:string;

	constructor(public navCtrl: NavController, public navParams: NavParams,
	public completeTestService: CompleteTestServiceProvider, public dbms: DatabaseProvider) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ContributePage');
		
		this.new_sentence['country'] = 'IN';
		this.new_sentence['contributor'] = 0;
		this.new_sentence['context'] = "General";

		this.translation['country'] = 'IN';
		this.translation['contributor'] = 0;
	}

	newForm() {
		console.log(this.new_sentence);
		this.dbms.insertNewSentence(
			this.new_sentence['sentence'], 
			this.new_sentence['language'], 
			this.new_sentence['country'], 
			this.new_sentence['contributor'], 
			this.new_sentence['context'], 
			this.new_sentence['speaker'] 
		);
		this.new_sentence['sentence'] = "";
		this.new_sentence['language'] = "";
		this.new_sentence['country'] = "IN";
		this.new_sentence['contributor'] = 0;
		this.new_sentence['context'] = "General";
		this.new_sentence['speaker'] = null;
	}

	changeSourceLanguage(language_code:string) {
		console.log("Source language set to " + language_code);
		this.dbms.showSentencesOfLanguage(language_code);
		this.completeTestService.setDatabaseMode(true);
		this.completeTestService.setShowMeaningIdInResults(true);
		this.completeTestService.setCurrentLanguage(language_code);
	}

	translateForm() {
		console.log(this.translated_sentence)
		// console.log(this.dbms.sentences_of_language);
		console.log(this.translation);
		let result = this.translated_sentence.match(/\[([0-9]+)\]$/i)
		// console.log(result)
		// console.log(result[1])
		this.dbms.insertTranslation(
			this.translation['sentence'],
			this.translation['language'],
			this.translation['country'],
			this.translation['contributor'],
			parseInt(result[1])
		);
		this.translation['sentence'] = "";
		this.translation['language'] = "";
		this.translation['country'] = "IN";
		this.translation['contributor'] = 0;
		this.translated_sentence = ""
	}

	showTables() {
		console.log("CROSS CHECKING:: " + this.dbms.sentences);
		console.log(this.translation);
		this.dbms.showSentences();
		this.dbms.showMeanings();
	}

	refreshTables() {
		this.dbms.refreshTables();
	}

}
