package com.ysiglobal.team3.clinictranslator;

import android.content.res.Resources;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
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

import java.util.LinkedList;
import java.util.Queue;

public class MainActivity extends AppCompatActivity {

    private Boolean activityState;
    private LinearLayout conversation;

    private String DoctorLanguage = null;
    private String PatientLanguage = null;

    private Queue<Pair<Integer, Integer>> chatQueue;

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

    protected void selectLanguage(View v) {
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
}
