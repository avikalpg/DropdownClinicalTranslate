import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	public textField:String = 'demo';
	public x = 8;
	public y = 3;
	z = 5;

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

	constructor(public navCtrl: NavController) {


		for (this.x = 0; this.x < HomePage.responseOptions.length; this.x++) {
			console.log(HomePage.responseOptions[this.x]);
		}

	}

}
