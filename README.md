# DropdownClinicalTranslate
Translator for interaction between patients and doctors

This project has two components:

1. **ClinicTranslator**: Android Studio application
2. **clinicAssist**: Ionic Application

----
## ClinicTranslator

The development of the Android Studio app has been halted on 25th July, 2018. You just install Android Studio (on any platform) and use the 'load existing project' option to starting working on this.

For testing, you can either use an Android Emulator or you can connect your own device. Alternatively, you can build-project and create a .apk file which can installed in any Android mobile phone.

----
## Ionic Application

### Introduction
Ionic is based on Apache Cordova, which enables us to write our application in AngularJS and converts that to create an app which can be released as Android app or well as IOS app.

### Installation

#### Development environment

#### Testing setup
For testing the app, you simply have to go to the folder and start the ionic service:

    cd clinicAssist/
    ionic serve -c

This will start the service and display the IP address and the port on which you can test the app. You can open this link in your own computer or any device which is connect using the same network (say on the same wifi). 

On an android device, you can use the [Ionic DevApp](https://play.google.com/store/apps/details?id=io.ionic.devapp&hl=en_IN) for testing the app. After you have installed the application on your android device, you only have to connect the device to the same network and you will be able to see the Ionic service (which has to be started in the manner explained above).

