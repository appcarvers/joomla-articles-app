import {App, IonicApp, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {GettingStartedPage} from './pages/getting-started/getting-started';
import {ListPage} from './pages/list/list';
import {DetailsPage} from './pages/details/details';
import {UniteMenu} from './unite-framework/unitemenu';
import {CategoryPage} from './pages/category/category';

@App({
  templateUrl: 'build/app.html',
  providers: [UniteMenu],
  config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
class MyApp {
  rootPage: any = ListPage;
  pages: any;
  uniteMenu: any;

  constructor(private app: IonicApp, private platform: Platform, uniteMenu: UniteMenu) {
    this.initializeApp();
    this.uniteMenu = uniteMenu;
    this.uniteMenu.menuMap = {
      'ListPage': ListPage,
      'CategoryPage': CategoryPage
    };

    this.uniteMenu.pages = [     
      { title: 'Article List', component: 'ListPage' },
      { title: 'Category', component: 'CategoryPage' }
      
    ];

    // used for an example of ngFor and navigation
    this.pages = this.uniteMenu.getMenu();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    let nav = this.app.getComponent('nav');
    nav.setRoot(this.uniteMenu.menuMap[page.component]);
  }
}
