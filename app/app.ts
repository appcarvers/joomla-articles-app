import {App, IonicApp, Platform, Events, LocalStorage, Storage, SqlStorage} from 'ionic-angular';
import {NgZone} from 'angular2/core';
import {StatusBar} from 'ionic-native';
import {GettingStartedPage} from './pages/getting-started/getting-started';
import {ListPage} from './pages/list/list';
import {DetailsPage} from './pages/details/details';
import {UniteMenu} from './unite-framework/unitemenu';
import {AddmenuPage} from './pages/addmenu/addmenu';
import {LoginPage} from './pages/login/login';
import {AddArticlePage} from './pages/addarticle/addarticle';
import {AddCatPage} from './pages/addcat/addcat';

@App({
  templateUrl: 'build/app.html',
  providers: [UniteMenu],
  config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
class MyApp {
  rootPage: any;//= AddArticlePage;
  pages: any;
  uniteMenu: any;
  local: any;

  constructor(private app: IonicApp, private platform: Platform, uniteMenu: UniteMenu, private events: Events, private zone: NgZone) {
    this.initializeApp();
    this.uniteMenu = uniteMenu;
    this.uniteMenu.menuMap = {
      'GettingStartedPage': GettingStartedPage,
      'ListPage': ListPage,
      'DetailsPage': DetailsPage,
      'AddmenuPage': AddmenuPage,
      'AddArticlePage': AddArticlePage,
      'AddCatPage': AddCatPage,
    };

    this.uniteMenu.pages = [
     // { title: 'First Page', component: 'GettingStartedPage' },
      { title: 'Articles Lists', component: 'ListPage' },
    //  { title: 'Details', component: 'DetailsPage', options: { item: { id: 3 } } },
     // { title: 'Add Menu', component: 'AddmenuPage' },
      { title: 'Add Article', component: 'AddArticlePage' },
      { title: 'Add Category', component: 'AddCatPage' },
    ];
    // used for an example of ngFor and navigation
    this.pages = [];
    this.local = new Storage(SqlStorage);

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.local.clear(); // use this when user logged out
      // One time Login
      
      this.local.get("authkey").then((value) => {
        if (value) {
          this.zone.run(() => {
            if (value) {
              this.rootPage = ListPage;

            } else {
              //this.rootPage = LoginPage;
              console.log('cleared');
            }
          });
        }
        else {
          this.rootPage = LoginPage;
        }
      });

      //End

      StatusBar.styleDefault();
      this.uniteMenu.getMenu().then((value) => {
        this.pages = value;
      });
      this.events.subscribe('page:added', (res) => {
        this.uniteMenu.addMenu(res[0]);
      });
      this.events.subscribe('page:removed', (index) => {
        this.uniteMenu.removeMenu(index[0]);
      });
      this.events.subscribe('page:updated', (res) => {
        this.uniteMenu.updateMenu(res[0]);
      });
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    let nav = this.app.getComponent('nav');
    nav.setRoot(this.uniteMenu.menuMap[page.component]);
  }
}
