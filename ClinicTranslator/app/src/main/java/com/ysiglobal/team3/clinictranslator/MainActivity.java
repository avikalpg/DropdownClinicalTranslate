package com.ysiglobal.team3.clinictranslator;

import android.content.Intent;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.util.Log;
import android.util.Pair;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.Locale;
import java.util.Queue;

public class MainActivity extends AppCompatActivity {

    private Boolean activityState;
    private LinearLayout conversation;

    private String DoctorLanguage = null;
    private String PatientLanguage = null;

    private Queue<Pair<Integer, Integer>> chatQueue;

    private HashMap<String, String> language_codes_map = new HashMap<>();

    public void setLanguageCodesMap() {
        language_codes_map.put("German", "de");
        language_codes_map.put("Chinese", "zh");
        language_codes_map.put("Czech", "cs");
        language_codes_map.put("Dutch", "nl");
        language_codes_map.put("French", "fr");
        language_codes_map.put("Italian", "it");
        language_codes_map.put("Japanese", "ja");
        language_codes_map.put("Korean", "ko");
        language_codes_map.put("Polish", "pl");
        language_codes_map.put("Russian", "ru");
        language_codes_map.put("Spanish", "es");
        language_codes_map.put("Arabic", "ar");
        language_codes_map.put("Bulgarian", "bg");
        language_codes_map.put("Catalan", "ca");
        language_codes_map.put("Croatian", "hr");
        language_codes_map.put("Danish", "da");
        language_codes_map.put("Finnish", "fi");
        language_codes_map.put("Greek", "el");
        language_codes_map.put("Hebrew", "iw");
        language_codes_map.put("Hindi", "hi");
        language_codes_map.put("Hungarian", "hu");
        language_codes_map.put("Indonesian", "in");
        language_codes_map.put("Latvian", "lv");
        language_codes_map.put("Lithuanian", "lt");
        language_codes_map.put("Norwegian", "nb");
        language_codes_map.put("Portuguese", "pt");
        language_codes_map.put("Romanian", "ro");
        language_codes_map.put("Serbian", "sr");
        language_codes_map.put("Slovak", "sk");
        language_codes_map.put("Slovenian", "sl");
        language_codes_map.put("Swedish", "sv");
        language_codes_map.put("Tagalog", "tl");
        language_codes_map.put("Thai", "th");
        language_codes_map.put("Turkish", "tr");
        language_codes_map.put("Ukrainian", "uk");
        language_codes_map.put("Vietnamese", "vi");
        language_codes_map.put("English", "en");
        language_codes_map.put("Afrikaans", "af");
    }

    public void queueNextItems(String response) {
        Resources resources = getResources();
        String[] primary_ailments_array = resources.getStringArray(R.array.primary_ailment_array);
        for (String str :
                primary_ailments_array) {
            Log.d("RESOURCE FOREACH", "queueNextItem: " + str);
        }

        /*
        TODO: This part is currently hard-coded
            such that the order in which the ailments are present will affect the response it will get
         */

        if (response.equals("__start__")) {
            chatQueue.add(new Pair<>(R.string.salutation_text, R.array.primary_ailment_array));
        }
        else if (response.equals(primary_ailments_array[1])) {
            chatQueue.add(new Pair<>(R.string.headache_question_1, R.array.durations_array));
            chatQueue.add(new Pair<>(R.string.headache_question_2, R.array.headache_point_array));
            chatQueue.add(new Pair<>(R.string.headache_question_3, R.array.headache_pain_type_array));
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        activityState = Boolean.FALSE;
        chatQueue = new LinkedList<>();

        setLanguageCodesMap();
        Spinner spinnerDoctor = findViewById(R.id.spinnerDoctorLanguage);
        Spinner spinnerPatient = findViewById(R.id.spinnerPatientLanguage);

        spinnerDoctor.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int pos, long id) {
                DoctorLanguage = adapterView.getItemAtPosition(pos).toString();
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {}
        });

        spinnerPatient.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int pos, long id) {
                PatientLanguage = adapterView.getItemAtPosition(pos).toString();
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {}
        });
    }

    public void selectLanguage(View v) {
        if(activityState){
            Button button = findViewById(R.id.goButton);
            button.setText(getString(R.string.submitLanguage));

//            conversation = findViewById(R.id.conversationLayout);
            if (conversation.getChildCount() > 0) {
                conversation.removeAllViews();
            }
            activityState = Boolean.FALSE;
        }
        else {
            Button button = findViewById(R.id.goButton);
            button.setText(getString(R.string.resetButton));

            Log.d("select Language", "Doctor\'s Language is " + DoctorLanguage + " and Patient\'s Language is " + PatientLanguage);
            chat("__start__");

            activityState = Boolean.TRUE;
        }
    }

    protected void chat(String input) {
        if (!input.isEmpty()) {
            // Adding next questions in the conversation based on current answer
            queueNextItems(input);

            // Asking the next question according to current chat queue
            Pair<Integer, Integer> nextItems = chatQueue.poll();
            if (nextItems == null) {
                TextView reply = new TextView(this);
                reply.setText(getString(R.string.exit_message));
                reply.setPadding(0, 8, 0, 8);
                conversation.addView(reply);
            } else {
                conversation = findViewById(R.id.conversationLayout);
                TextView reply = new TextView(this);
                reply.setTextSize(18);
                reply.setPadding(0, 16, 16, 8);
                reply.setText(getString(nextItems.first));
                conversation.addView(reply);

                Spinner response = new Spinner(this);
                String[] list = getResources().getStringArray(nextItems.second);
                ArrayAdapter<String> dataAdapter = new ArrayAdapter<>(this,
                        android.R.layout.simple_spinner_item, list);
                dataAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                response.setAdapter(dataAdapter);
                response.setPadding(32, 8, 0, 16);

                response.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                    @Override
                    public void onItemSelected(AdapterView<?> adapterView, View view, int pos, long id) {
                        //                    Toast.makeText(adapterView.getContext(),
                        //                            "Last Response:" + adapterView.getItemAtPosition(pos).toString(),
                        //                            Toast.LENGTH_SHORT).show();
                        chat(adapterView.getItemAtPosition(pos).toString());
                    }

                    @Override
                    public void onNothingSelected(AdapterView<?> adapterView) {

                    }
                });

                conversation.addView(response);
            }

            conversation.invalidate();
        }
    }

    public void setLocale(String lang) {
        Locale myLocale = new Locale(lang);
        Resources res = getResources();
        DisplayMetrics dm = res.getDisplayMetrics();
        Configuration conf = res.getConfiguration();
        conf.locale = myLocale;
        res.updateConfiguration(conf, dm);
        Intent refresh = new Intent(this, MainActivity.class);
        startActivity(refresh);
        finish();
    }

    public void translate(View v) {
        setLocale(language_codes_map.get(DoctorLanguage));
    }
}
