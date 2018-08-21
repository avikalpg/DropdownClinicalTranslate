import { Injectable } from '@angular/core';
import { AutoCompleteService } from 'ionic2-auto-complete';

/*
	Generated class for the CompleteTestServiceProvider provider.

	See https://angular.io/guide/dependency-injection for more info on providers
	and Angular DI.
*/
@Injectable()
export class CompleteTestServiceProvider implements AutoCompleteService {

	private doctor_language:string;
	private patient_language:string;

	private current_language:string;
	labelAttribute = "name";


	private doctor_response_list: { [id:string] : String[] } = {
		"en" : [
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
		],
		"hi" : [
			"आपका स्वास्थ्य कैसा है?",
			"आप कितने साल के हैं?",
			"आपको कब से ये दिक्कत हैं?",
			"जहां आपको दर्द महसूस होता है वहां इशारा करें।",
			"आप किस तरह का दर्द अनुभव कर रहे हैं?",
			"क्या आपको कोई एलर्जी है?",
			"अपना मुहँ खोलो।",
			"अपनी जीभ बाहर निकालो।",
			"मैं कुछ दवाएं लिख रहा हूं।",
			"खाने के बाद पानी के साथ इस गोली को लेना",
			"ज्यादा पानी पियो",
			"अगले हफ्ते फिर से आओ",
			"चिंता मत करो, आप बहुत जल्द ठीक हो जाएंगे।",
		]
	};

	private patient_response_list: { [id:string] : String[] } = {
		"en" : [
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
		],
		"hi" : [
	        "सरदर्द",
	        "पेट दर्द",
	        "चोट",
	        "सर्दी",
	        "बुखार",
	        "आंखों के पीछे",
	        "सिर के शीर्ष पर",
	        "सिर के पीछे",
	        "माथे पर",
	        "Temples",
	        "भयानक दर्द",
	        "जलन",
	        "धड़कता दर्द",
	    ]
	};



	constructor() {
		console.log('Hello CompleteTestServiceProvider Provider');
	}

	setDoctorLanguage(language_code:string) {
		this.doctor_language = language_code;
	}

	setPatientLanguage(language_code:string) {
		this.patient_language = language_code;
	}

	setCurrentLanguage(language_code:string) {
		this.current_language = language_code;
	}

	private stringMatchLogic(keyword:String, option:String) {
		return option.toLowerCase().includes(keyword.toLowerCase())
	}

	getResults(keyword:string) {
		if (this.current_language == this.doctor_language) {
			return this.doctor_response_list[this.current_language].filter(item => this.stringMatchLogic(keyword, item));
		}
		else if (this.current_language == this.patient_language) {
			return this.patient_response_list[this.current_language].filter(item => this.stringMatchLogic(keyword, item));
		}
		else {
			console.log("[getResponses] ERROR: The current language is neither doctor's language nor patient's language");
		}
	}


}
