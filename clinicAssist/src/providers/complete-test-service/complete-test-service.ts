import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../../providers/database/database';
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


	/***************************************************************
	* TODO: Remove the database_mode parameter from this function

	database_mode parameter has been created only to ease the transition
	from creating a completely static list of options to creating a list
	of options created using the database of sentences.

	values:
		false: it uses the doctor_response_list and the patient_response_list
		true: it extract sentences from the database
	***************************************************************/
	private database_mode:boolean = false;

	private show_meaning_id_in_results_flag: boolean = false;

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
	        "कनपटी",
	        "भयानक दर्द",
	        "जलन",
	        "धड़कता दर्द",
	    ]
	};

	private db_response_list: String[];

	constructor(public dbms: DatabaseProvider) {
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

	// TODO: Remove this function when you remove the database_mode variable
	setDatabaseMode(db_mode:boolean) {
		this.database_mode = db_mode;
	}

	setShowMeaningIdInResults(mid_flag:boolean) {
		this.show_meaning_id_in_results_flag = mid_flag;
	}

	private stringMatchLogic(keyword:String, option:String) {
		return option.toLowerCase().includes(keyword.toLowerCase())
	}

	getResults(keyword:string) {
		if (this.database_mode) {
			console.log(">db_mode> Current Language:" + this.current_language )

			// use the database to extract sentences
			this.db_response_list = [];
			for (var i = 0; i < this.dbms.sentences_of_language.length; i++){
				// console.log(this.dbms.sentences_of_language[i])
				if (this.show_meaning_id_in_results_flag) {
					this.db_response_list.push(this.dbms.sentences_of_language[i]['sentence'] + " [" + this.dbms.sentences_of_language[i]['meaning_id'] + "]");
				}
				else {
					this.db_response_list.push(this.dbms.sentences_of_language[i]['sentence']);
				}
			}
			// console.log(this.db_response_list)
			return this.db_response_list.filter(item => this.stringMatchLogic(keyword, item));
		}
		else {
			if (this.current_language == this.doctor_language) {
				console.log(">1> Current Language:" + this.current_language )
				return this.doctor_response_list[this.current_language].filter(item => this.stringMatchLogic(keyword, item));
			}
			else if (this.current_language == this.patient_language) {
				console.log(">2> Current Language:" + this.current_language )
				return this.patient_response_list[this.current_language].filter(item => this.stringMatchLogic(keyword, item));
			}
			else {
				console.log("[getResponses] ERROR: The current language is neither doctor's language nor patient's language");
			}
		}
	}


}
