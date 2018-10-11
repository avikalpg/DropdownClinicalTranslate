import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AutoCompleteModule } from 'ionic2-auto-complete';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { TranslatorPage } from '../pages/translator/translator';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CompleteTestServiceProvider } from '../providers/complete-test-service/complete-test-service';
import { SQLite, SQLiteDatabaseConfig } from '@ionic-native/sqlite'

declare var SQL;

class SQLiteMock {
  public create(config: SQLiteDatabaseConfig): Promise<SQLiteObject> {
    //since this is an in memory database we can ignore the config parameters 

    var db = new SQL.Database();

    return new Promise((resolve,reject) => {
        resolve(new SQLiteObject(db));
    });
  }
}

class SQLiteObject{
  _objectInstance: any;

  constructor(_objectInstance: any){
    this._objectInstance = _objectInstance;
  };

  executeSql(statement: string, params: any): Promise<any>{
    return new Promise((resolve,reject)=>{
      try {
        var st = this._objectInstance.prepare(statement,params);
        var rows :Array<any> = [] ;
        while(st.step()) { 
          var row = st.getAsObject();
          rows.push(row)
        }
        var payload = {
          rows: {
            item: function(i) {
              return rows[i];
            },
            length: rows.length
          },
          rowsAffected: this._objectInstance.getRowsModified() || 0,
          insertId: this._objectInstance.insertId || void 0
        };  
        resolve(payload);
      } catch(e){
        reject(e);
      }
    });
  };
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    TranslatorPage
  ],
  imports: [
    BrowserModule,
    AutoCompleteModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    TranslatorPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CompleteTestServiceProvider,
    {provide: SQLite, useClass: SQLiteMock}
  ]
})
export class AppModule {}
