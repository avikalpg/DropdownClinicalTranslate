import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/*
	Generated class for the DatabaseProvider provider.

	See https://angular.io/guide/dependency-injection for more info on providers
	and Angular DI.
*/
@Injectable()
export class DatabaseProvider {

	// Database related objects
	public database: SQLiteObject;
	public sentences: Array<Object>;
	public sentences_of_language: Array<Object>;
	public meanings: Array<Object>;
	public translations: Array<Object>;

	constructor(private sqlite: SQLite) {
		console.log('Hello DatabaseProvider Provider');
		this.sqlite.create({name: "data.db", location: "default"}).then((db : SQLiteObject) => {
				this.database = db;
				this.createTables();
			}, (error) => {
				console.log("ERROR: ", error);
			});
	}

	public createTables(){
		this.database.executeSql('create table if not exists meanings( \
			id integer primary key autoincrement, \
			type INTEGER, \
			response_type INTEGER, \
			speaker_type INTEGER, \
			context VARCHAR(32) \
			)', [])
			.then(() => {
				console.log('Table Meanings created !');
			})
			.catch(e => console.log(e));

		this.database.executeSql('create table if not exists sentences( \
			id integer primary key autoincrement, \
			sentence VARCHAR(256), \
			meaning_id INTEGER, \
			language VARCHAR(32), \
			country VARCHAR(16), \
			contributor INTEGER, \
			is_original INTEGER, \
			upload_status INTEGER, \
			FOREIGN KEY(meaning_id) REFERENCES meanings(id) \
			)', [])
			.then(() => {
				console.log('Table Sentences created !');
			})
			.catch(e => console.log(e));
	}

	public refreshTables(){
		this.database.executeSql('drop table if exists meanings;', [])
			.then(() => {
				console.log('Table Meanings dropped !');
			})
			.catch(e => console.log(e));

		this.database.executeSql('drop table if exists sentences;', [])
			.then(() => {
				console.log('Table Sentences created !');
			})
			.catch(e => console.log(e));

		this.createTables();
	}

	public insertNewSentence(sentence_text: String, language: String, country: String, contributor: number, context: String, speaker: number){
		this.database.executeSql("INSERT INTO meanings (context, speaker_type) VALUES (?, ?)", [context, speaker]).then((data) => {
				console.log("INSERTED MEANING: " + sentence_text);
			}, (error) => {
				console.log("ERROR: " + JSON.stringify(error.err));
			});	

		this.database.executeSql("SELECT MAX(id) FROM meanings;", []).then((results) => {
				if(results.rows.length == 1) {
					var meaning_id = results.rows.item(0)['MAX(id)'];
					console.log("meaning_id: " + meaning_id)
					var values = [sentence_text, meaning_id, language, country, contributor, 1, 0];
					this.database.executeSql("INSERT INTO sentences (sentence, meaning_id, language, country, contributor, is_original, upload_status) VALUES (?, ?, ?, ?, ?, ?, ?)", values).then((data) => {
							console.log("INSERTED SENTENCE: " + sentence_text);
						}, (error) => {
							console.log("ERROR: " + JSON.stringify(error.err));
						});	
				}
				else {
					console.log("ERROR: Max function resulted more than one outputs for id of meanings table")
				}
			}, (error) => {
				console.log("ERROR: " + JSON.stringify(error.err));
			})
	}

	public insertTranslation(sentence_text: String, language: String, country: String, contributor: number, meaning_id: number) {
		var values = [sentence_text, meaning_id, language, country, contributor, 0, 0];
	
		this.database.executeSql("INSERT INTO sentences (sentence, meaning_id, language, country, contributor, is_original, upload_status) VALUES (?, ?, ?, ?, ?, ?, ?)", values).then((data) => {
				console.log("INSERTED SENTENCE: " + sentence_text + " for meaning-id: " + meaning_id);
			}, (error) => {
				console.log("ERROR: " + JSON.stringify(error.err));
			});	
	}

	public showSentences(){
		this.database.executeSql("SELECT * FROM sentences", []).then((data) => {
				this.sentences = [];
				if(data.rows.length > 0) {
					for(var i = 0 ; i < data.rows.length ; i++) {
						this.sentences.push({ name: data.rows.item(i) });
					}
				}
				console.log(this.sentences);
			}, (error) => {
				console.log("ERROR: " + JSON.stringify(error));
			});
	}

	public showSentencesOfLanguage(language:String){
		this.database.executeSql("SELECT * FROM sentences WHERE language = ?", [language]).then((data) => {
				this.sentences_of_language = [];
				if(data.rows.length > 0) {
					for(var i = 0 ; i < data.rows.length ; i++) {
						this.sentences_of_language.push(data.rows.item(i));
					}
				}
				console.log(this.sentences_of_language);
			}, (error) => {
				console.log("ERROR: " + JSON.stringify(error));
			});
	}

	public showMeanings(){
		this.database.executeSql("SELECT * FROM meanings", []).then((data) => {
				this.meanings = [];
				if(data.rows.length > 0) {
					for(var i = 0 ; i < data.rows.length ; i++) {
						this.meanings.push({ name: data.rows.item(i) });
					}
				}
				console.log(this.meanings);
			}, (error) => {
				console.log("ERROR: " + JSON.stringify(error));
			});
	}

	public getTranslation(sentence_id: number, target_language: String){
		if (this.sentences.length == 0) {
			this.getTranslationFromDB(sentence_id, target_language);
			// This will work only if Javascript returns a pointer to the variable
			// NOTE: You will not be able to see the translations if you print translations
			// at this point
			return this.translations
		}
		else {
			
		}
	}

	public getTranslationFromDB(sentence_id: number, target_language: String) {
		this.database.executeSql("SELECT * FROM sentences WHERE meaning_id = (SELECT meaning_id FROM sentences WHERE id = ?)",
		 [sentence_id]).then((results) => {
		 	var meaning_id = results.rows.item(0).meaning_id;
		 	console.log("meaning_id" + meaning_id);
		 	this.translations = [];
				if(results.rows.length > 0) {
					for(var i = 0 ; i < results.rows.length ; i++) {
						this.translations.push({ name: results.rows.item(i) });
					}
				}
				console.log(this.translations);
		 }, (error) => {
		 	console.log("ERROR: " + JSON.stringify(error));
		 });
	}

}
