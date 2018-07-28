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


  constructor(public navCtrl: NavController) {

  }

}
