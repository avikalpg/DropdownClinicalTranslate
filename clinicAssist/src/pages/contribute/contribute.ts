import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public dbms: DatabaseProvider) {
  }

  ionViewDidLoad() {
  	this.dbms.showSentences();
    console.log('ionViewDidLoad ContributePage');
    
    this.new_sentence['country'] = 'IN';
    this.new_sentence['contributor'] = 0;
    this.new_sentence['context'] = "General";

    this.translation['country'] = 'IN';
    this.translation['contributor'] = 0;
  }

  newForm() {
  	console.log(this.new_sentence);
  	this.dbms.insertNewSentence(this.new_sentence['sentence'], this.new_sentence['language'], this.new_sentence['country'], 
  		this.new_sentence['contributor'], this.new_sentence['context'] );
  }

  translateForm() {
    console.log("CROSS CHECKING:: " + this.dbms.sentences);
  	console.log(this.translation);
  	this.dbms.showSentences();
  	this.dbms.showMeanings();
  	this.dbms.showSentenceMeaning();
  }

  refreshTables() {
  	this.dbms.refreshTables();
  }

}
