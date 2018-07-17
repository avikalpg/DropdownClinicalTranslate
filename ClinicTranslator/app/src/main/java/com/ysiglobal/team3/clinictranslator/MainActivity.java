package com.ysiglobal.team3.clinictranslator;

import android.content.Intent;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.Color;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.util.Log;
import android.util.Pair;
import android.view.Gravity;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Queue;

public class MainActivity extends AppCompatActivity {

    private Boolean activityState;
    private LinearLayout conversation;

    private String DoctorLanguage = null;
    private String PatientLanguage = null;

    private ArrayList<Pair<Integer, Integer>> chatQueue;

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

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        activityState = Boolean.FALSE;
        chatQueue = new ArrayList<>();

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
            setLocale(language_codes_map.get(DoctorLanguage));
            Button button = findViewById(R.id.goButton);
            button.setText(getString(R.string.resetButton));

            Log.d("select Language", "Doctor\'s Language is " + DoctorLanguage + " and Patient\'s Language is " + PatientLanguage);
            chat("__start__");

            activityState = Boolean.TRUE;
        }
    }

    protected void chat(String input) {
        if (!input.isEmpty()) {

            conversation = findViewById(R.id.conversationLayout);
            Log.d("LinearLayout", "chat: Length of new:" + conversation.getChildCount());
//            TextView reply = new TextView(this);
//            reply.setTextSize(18);
//            reply.setPadding(0, 16, 16, 8);
//            reply.setText(getString(nextItems.first));
//            conversation.addView(reply);

            Spinner response = new Spinner(this);
            Integer response_array_id;
            if (getResources().getConfiguration().locale.getLanguage().equals(language_codes_map.get(DoctorLanguage))){
                response_array_id = R.array.doctor_responses;
            }
            else if (getResources().getConfiguration().locale.getLanguage().equals(language_codes_map.get(PatientLanguage))){
                response_array_id = R.array.patient_responses;
            }
            else {
                Toast.makeText(this, "The current language is used by neither the doctor nor the patient", Toast.LENGTH_SHORT).show();
                Toast.makeText(this, "We will implement a mediator response spinner as well", Toast.LENGTH_SHORT).show();
                setLocale(language_codes_map.get(DoctorLanguage));
                response_array_id = R.array.doctor_responses;
            }
            chatQueue.add(new Pair<>(response_array_id, 0));
            String[] list = getResources().getStringArray(response_array_id);
            ArrayAdapter<String> dataAdapter = new ArrayAdapter<>(this,
                    android.R.layout.simple_spinner_item, list);
            dataAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
            response.setAdapter(dataAdapter);
            response.setPadding(32, 8, 0, 16);

            response.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                @Override
                public void onItemSelected(AdapterView<?> adapterView, View view, int pos, long id) {
                    if (pos != 0) {
                        int last_index = chatQueue.size() - 1;
                        chatQueue.set(last_index, new Pair<>(chatQueue.get(last_index).first, pos));
                    }
                    chat(adapterView.getItemAtPosition(pos).toString());
                }

                @Override
                public void onNothingSelected(AdapterView<?> adapterView) {

                }
            });
            conversation.addView(response);

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
//        Intent refresh = new Intent(this, MainActivity.class);
//        startActivity(refresh);
//        finish();
    }

    public void translate(View v) throws Exception {
        Log.d("LinearLayout", "translate: Length of conversation:" + conversation.getChildCount());
        if (getResources().getConfiguration().locale.getLanguage().equals(language_codes_map.get(DoctorLanguage))){
            setLocale(language_codes_map.get(PatientLanguage));
        }
        else if (getResources().getConfiguration().locale.getLanguage().equals(language_codes_map.get(PatientLanguage))){
            setLocale(language_codes_map.get(DoctorLanguage));
        }
        else {
            Toast.makeText(this, "The current language is used by neither the doctor nor the patient", Toast.LENGTH_SHORT).show();
            Toast.makeText(this, "We will implement a mediator response spinner as well", Toast.LENGTH_SHORT).show();
            setLocale(language_codes_map.get(DoctorLanguage));
        }

        if (conversation.getChildCount() != chatQueue.size()) {
            Log.d("EXCEPTION", "translate: conversation length:" + conversation.getChildCount() + " and chatQueue length:" + chatQueue.size());
            throw new Exception(">>> Invalid Application variable state! <<<");
        }
        if (conversation.getChildCount() > 0) {
            conversation.removeAllViews();
            cleanChatQueue();
            for (Pair<Integer, Integer> responseLine:
                 chatQueue) {
                TextView reply = new TextView(this);
                reply.setTextSize(18);
                if (responseLine.first == R.array.doctor_responses) {
                    reply.setPadding(0, 0, 16, 0);
                    reply.setTextColor(Color.BLUE);
                    reply.setGravity(Gravity.LEFT);
                } else if (responseLine.first == R.array.patient_responses) {
                    reply.setPadding(16, 0, 0, 0);
                    reply.setTextColor(Color.RED);
                    reply.setGravity(Gravity.RIGHT);
                }
                reply.setText(getResources().getStringArray(responseLine.first)[responseLine.second]);
                conversation.addView(reply);
            }

            conversation.invalidate();
            int last_index = chatQueue.size() - 1;
            chat(getResources().getStringArray(chatQueue.get(last_index).first)[chatQueue.get(last_index).second]);
        }
    }

    private void cleanChatQueue() {
        for (int i = 0; i < chatQueue.size(); i++) {
            if (chatQueue.get(i).second == 0) {
                chatQueue.remove(i);
            }
        }
    }
}
