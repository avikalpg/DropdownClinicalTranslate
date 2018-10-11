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
	public meanings: Array<Object>;
	public sentence_meaning: Array<Object>;

	constructor(private sqlite: SQLite) {
		console.log('Hello DatabaseProvider Provider');
		this.sqlite.create({name: "data.db", location: "default"}).then((db : SQLiteObject) => {
				this.database = db;
				// this.createTable();
			}, (error) => {
				console.log("ERROR: ", error);
			});
	}

	public createTable(){
		this.database.executeSql('create table if not exists sentences( \
			id integer primary key autoincrement, \
			sentence VARCHAR(256), \
			language VARCHAR(32), \
			country VARCHAR(16), \
			contributor INTEGER, \
			type INTEGER, \
			response_type INTEGER, \
			is_original INTEGER, \
			upload_status INTEGER \
			)', [])
			.then(() => {
				console.log('Table Sentences created !');
			})
			.catch(e => console.log(e));
		this.database.executeSql('create table if not exists meanings( \
			id integer primary key autoincrement, \
			context VARCHAR(32) \
			)', [])
			.then(() => {
				console.log('Table Meanings created !');
			})
			.catch(e => console.log(e));
		this.database.executeSql('create table if not exists sentence_meaning( \
				id integer primary key autoincrement, \
				sentence_id integer, \
				meaning_id integer, \
				FOREIGN KEY(sentence_id) REFERENCES sentences(id), \
				FOREIGN KEY(meaning_id) REFERENCES meanings(id) \
				)', [])
			.then(() => {
				console.log('Table Sentence-Meaning created !');
			})
			.catch(e => console.log(e));
	}

	public insertNewSentence(sentence_text: String, language: String, country: String, contributor: number, context: String){
		var meaning_id: number;
		var sentence_id: number;
		this.database.executeSql("INSERT INTO meanings (context) VALUES (?)", [context]).then(function(data) {
				console.log("INSERTED MEANING: " + sentence_text);
				console.log(data);
				console.log(this);
				meaning_id = data.insertId;
			}, (error) => {
				console.log("ERROR: " + JSON.stringify(error.err));
			});	

		var values = [sentence_text, language, country, contributor, 1, 0];
		this.database.executeSql("INSERT INTO sentences (sentence, language, country, contributor, is_original, upload_status) VALUES (?, ?, ?, ?, ?, ?)", values).then((data) => {
				console.log("INSERTED SENTENCE: " + sentence_text);
				console.log(data);
				console.log(this);
				sentence_id = data.insertId;
			}, (error) => {
				console.log("ERROR: " + JSON.stringify(error.err));
			});	

		this.database.executeSql("INSERT INTO sentence_meaning (sentence_id, meaning_id) VALUES (?,?)", [sentence_id, meaning_id]).then((data) => {
				console.log("INSERTED Mapping: " + sentence_text);
			}, (error) => {
				console.log("ERROR: " + JSON.stringify(error.err));
			});
	}

	public insertTranslation(sentence_text: String, language: String, country: String, contributor: number, meaning_id: number) {
		var sentence_id: number;
		var values = [sentence_text, language, country, contributor, 0, 0];
	
		this.database.executeSql("INSERT INTO sentences (sentence, language, country, contributor, is_original, upload_status) VALUES (?, ?, ?, ?, ?, ?)", values).then((data) => {
				console.log("INSERTED SENTENCE: " + sentence_text);
				sentence_id = data.insertId;
			}, (error) => {
				console.log("ERROR: " + JSON.stringify(error.err));
			});	

		this.database.executeSql("INSERT INTO sentence_meaning (sentence_id, meaning_id) VALUES (?,?)", [sentence_id, meaning_id]).then((data) => {
				console.log("INSERTED Mapping: " + sentence_text);
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

	public showSentenceMeaning(){
		this.database.executeSql("SELECT * FROM sentence_meaning", []).then((data) => {
				this.sentence_meaning = [];
				if(data.rows.length > 0) {
					for(var i = 0 ; i < data.rows.length ; i++) {
						this.sentence_meaning.push({ name: data.rows.item(i) });
					}
				}
				console.log(this.sentence_meaning);
			}, (error) => {
				console.log("ERROR: " + JSON.stringify(error));
			});
	}

	public getTranslation(sentence_text:String, target_language: String) {
		var meaning_id:number;
		this.database.executeSql("SELECT sm.meaning_id FROM (SELECT id FROM sentences WHERE sentence == ?) AS s0 INNER JOIN sentence_meaning AS sm ON s0.id = sm.sentence_id)",
		 [sentence_text]).then((results) => {
		 	meaning_id = results.rows.item(0).meaning_id;
		 	console.log("meaning_id" + meaning_id);
		 }, (error) => {
		 	console.log("ERROR: " + JSON.stringify(error));
		 });
	}

}
