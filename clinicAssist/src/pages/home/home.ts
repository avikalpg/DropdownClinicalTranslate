import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite'

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	public textField:String = 'demo';
	public x = 8;
	public y = 3;
	z = 5;

	public database: SQLiteObject;
	public invoices: Array<Object>;
	public counter: number = 0;

	static responseOptions:string[] = [
		"How are you?", 
		"You are great!", 
		"Option3", 
		"Headache", 
		"What is your age?"
	];


	stringChange() {
		console.log("---------------stringChange entered------------------------");
	}

	getResults(keyword:string) {
		this.x = 1212;
		console.log(HomePage.responseOptions);
		console.log(this.x);
		console.log(this.z);
		// let responseOptions:string[] = ["How are you?", "You are great!", "Option3", "Headache", "What is your age?"];
		return HomePage.responseOptions.filter(item => {
			return item.toLowerCase().startsWith(keyword.toLowerCase())
		});
	}

	constructor(public navCtrl: NavController, private sqlite: SQLite) {


		for (this.x = 0; this.x < HomePage.responseOptions.length; this.x++) {
			console.log(HomePage.responseOptions[this.x]);
		}

	}


	ionViewDidEnter() {
		console.log("view did enter");
		this.sqlite.create({name: "data.db", location: "default"}).then((db : SQLiteObject) => {
                this.database = db;
                this.createTable();
            }, (error) => {
            	console.log("ERROR: ", error);
            });
	}

	public createTable(){
	    this.database.executeSql('create table if not exists invoices(name VARCHAR(32))', {})
	        .then(() => {
	            console.log('Table Invoice created !');

	        })
	        .catch(e => console.log(e));    
	}

	public insertInvoice(){
	    var c = 'INV' + this.counter; 
	    this.database.executeSql("INSERT INTO invoices (name) VALUES (?)", [c]).then((data) => {
	            console.log("INSERTED: ");
	            this.counter++;
	            this.showInvoices();
	        }, (error) => {
	            console.log("ERROR: " + JSON.stringify(error.err));
	        });    
	}

	public showInvoices(){
	    this.database.executeSql("SELECT * FROM invoices", []).then((data) => {
	            this.invoices = [];
	            if(data.rows.length > 0) {
	                for(var i = 0 ; i < data.rows.length ; i++) {
	                    this.invoices.push({ name: data.rows.item(i).name });
	                }
	            }
	        }, (error) => {
	            console.log("ERROR: " + JSON.stringify(error));
	        });    
	}

}
