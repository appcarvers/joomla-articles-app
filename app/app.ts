import {App, IonicApp, Platform, Events, LocalStorage, Storage, SqlStorage} from 'ionic-angular';
import {NgZone} from 'angular2/core';
import {StatusBar} from 'ionic-native';
import {GettingStartedPage} from './pages/getting-started/getting-started';
import {ListPage} from './pages/list/list';
import {DetailsPage} from './pages/details/details';
import {UniteMenu} from './unite-framework/unitemenu';
import {UniteItem} from './unite-framework/uniteitem';
import {AddmenuPage} from './pages/addmenu/addmenu';
import {LoginPage} from './pages/login/login';
import {AddArticlePage} from './pages/addarticle/addarticle';
import {AddCatPage} from './pages/addcat/addcat';
import {SiteConfig} from './providers/site-config/site-config';
import {UniteToast} from './unite-framework/unitetoast';
import {ImageUpload} from './unite-framework/image-upload';

@App({
  templateUrl: 'build/app.html',
  providers: [UniteMenu, UniteItem, SiteConfig, ImageUpload, UniteToast],
  config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
class MyApp {
  rootPage: any;//= AddArticlePage;
  pages: any;
  uniteMenu: any;
  local: any;
  items: any;
  uniteItem: any;
  submenuitem: boolean;
  category: string;
  siteconfig: any;
  constructor(private app: IonicApp, uniteItem: UniteItem, private platform: Platform, uniteMenu: UniteMenu, private events: Events, private zone: NgZone, siteconfig: SiteConfig) {
    this.initializeApp();
    this.uniteMenu = uniteMenu;
    this.submenuitem = false;
    this.category = "false"
    this.siteconfig = siteconfig;
    this.uniteMenu.menuMap = {
      'GettingStartedPage': GettingStartedPage,
      'ListPage': ListPage,
      'DetailsPage': DetailsPage,
      'AddmenuPage': AddmenuPage,
      'AddArticlePage': AddArticlePage,
      'AddCatPage': AddCatPage,
    };

    this.uniteMenu.pages = [
      { title: 'Articles List', component: 'ListPage' },
      // { title: 'Add Menu', component: 'AddmenuPage' },
      { title: 'Add Article', component: 'AddArticlePage' },
      { title: 'Add Category', component: 'AddCatPage' },

    ];
    // used for an example of ngFor and navigation
    this.pages = [];
    this.local = new Storage(SqlStorage);
    this.uniteItem = uniteItem;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.local.clear(); // use this when user logged out
      // One time Login

      this.local.get("siteConfig").then((value) => {
        if (value) {
          this.siteconfig.setConfig(JSON.parse(value));
          this.loadData();
          this.zone.run(() => {
            if (value) {
              this.rootPage = ListPage;

            } else {
              //this.rootPage = LoginPage;
            }
          });
        }
        else {
          this.rootPage = LoginPage;
        }
      });

      //End

      StatusBar.styleDefault();
      this.events.subscribe('login:success', (res) => {
        this.loadData();
      });
      this.uniteMenu.getMenu().then((value) => {
        this.pages = value;
      });
      this.events.subscribe('page:added', (res) => {
        this.loadData();
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

    if (page.component == 'CatPage' && this.submenuitem == false) {
      this.submenuitem = true;

      nav.setRoot(ListPage, { item: page.id });
    } else {
      this.submenuitem = false;
    }


    if (page.id) {
      nav.setRoot(ListPage, { item: page.id });
      // nav.setRoot(this.uniteMenu.menuMap[ListPage]), {item: page.id});
    } else {

      nav.setRoot(this.uniteMenu.menuMap[page.component]);
    }
  }

  openPage1(page) {
    let nav = this.app.getComponent('nav');
    nav.setRoot(ListPage, { item: page.id, title: page.title });
  }
  Logout() {
    this.local.clear();
    let nav = this.app.getComponent('nav');
    nav.setRoot(LoginPage);
  }
  // loadData() {
  //      let url = this.siteconfig.getConfig().siteurl + '/index.php?option=com_api&app=categories&resource=categories&format=raw&lang=en&key=' + this.siteconfig.getConfig().authkey;
  //       this.uniteItem.getData(url).then((value: any) => {
  // 	if(value){
  // 			this.items = value;
  // 		}
  // 	});
  // }
  loadData() {
    let config = this.siteconfig.getConfig();
    let url = config.siteurl + '/index.php?option=com_api&app=categories&resource=categories&format=raw&lang=en&key=' + config.authkey;
    this.uniteItem.getData(url).then((value: any) => {
      if (value) {
        this.items = value;
      }
    });
  }
}
