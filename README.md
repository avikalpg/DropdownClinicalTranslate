# DropdownClinicalTranslate
Translator for interaction between patients and doctors

This project has two components:

1. **ClinicTranslator**: Android Studio application
2. **clinicAssist**: Ionic Application

----
## ClinicTranslator

The development of the Android Studio app has been halted on 25th July, 2018. You just install Android Studio (on any platform) and use the 'load existing project' option to starting working on this.

For testing, you can either use an Android Emulator or you can connect your own device. Alternatively, you can build-project and create a .apk file which can installed in any Android mobile phone.

Note: You will need JAVA installed in your machine

----
## clinicAssist: Ionic Application

### Introduction
Ionic is based on Apache Cordova, which enables us to write our application in AngularJS and converts that to create an app which can be released as Android app or well as IOS app.

### Installation

The installation instructions for all the environments can be viewed on the [Ionic Framework Website](https://ionicframework.com/docs/intro/installation/). You can also use this [more detailed guide](https://ionicframework.com/docs/v1/guide/installation.html), which is from an older version but the installation steps still work.

If you are operating on Ubuntu (or any Linux distribution - including the one on Windows), the following steps should be enough:

1. Install NodeJS and NPM

	```
    sudo apt-get update && sudo apt-get upgrade
    sudo apt-get install nodejs
    sudo apt-get install npm
    ```

2. After that, you can use the NPM installer to install Cordova and Ionic

	```
    sudo npm install -g cordova
    sudo npm install -g ionic
    sudo npm install -g n
    ```

3. This much is enough for the development and testing purposes. It might beneficial to run the following commands, which might enable you to create the release builds for android and ios

	```
    ionic cordova platform add ios
    ionic cordova plotform add android
    ```


#### Development environment

To be able to serve the application completely, you will also have to install certain component modules have been used in the project. Here is the list of the ones that are used:

* Auto-complete

	```
    npm audit fix
    sudo npm install ionic2-auto-complete --save
    ```


#### Testing setup
For testing the app, you simply have to go to the folder and start the ionic service:

    cd clinicAssist/
    ionic serve -c

This will start the service and display the IP address and the port on which you can test the app. You can open this link in your own computer or any device which is connect using the same network (say on the same wifi). 

On an android device, you can use the [Ionic DevApp](https://play.google.com/store/apps/details?id=io.ionic.devapp&hl=en_IN) for testing the app. After you have installed the application on your android device, you only have to connect the device to the same network and you will be able to see the Ionic service (which has to be started in the manner explained above).

#### Additional tips on testing
When deploying the app to create the native deployment of the program (i.e. a .apk file in case of Android), change the following lines in `app.module.ts`:

    {provide: SQLite, useClass: SQLiteMock}
 Replace the above line with the following line:
    SQLite

This is to be able to use the actual Native SQLite database in a device instead of an in memory database