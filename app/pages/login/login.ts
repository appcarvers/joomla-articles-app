import {Page, MenuController, Events, NavController, Loading, IonicApp, NavParams, Storage, SqlStorage} from 'ionic-angular';
import {Http, Headers} from 'angular2/http';
import {UniteList} from '../../unite-framework/unitelist';
import {UniteToast} from '../../unite-framework/unitetoast';
import {ListPage} from '../list/list';
import {SiteConfig} from '../../providers/site-config/site-config';
@Page({
  templateUrl: 'build/pages/login/login.html',
  providers: [UniteList],
})

export class LoginPage {
  private login: any;
  private submitted: boolean;
  resultdata: any;
  data: any;
  http: Http;
  baseurl: string;
  payloaddata: string;
  local: any;
  events: Events;
  unitetoast: UniteToast;
  loader:Loading;
  loaderconfig:any;
  constructor(private app: IonicApp, private menu: MenuController, private nav: NavController, http: Http, unitetoast: UniteToast, private siteconfig: SiteConfig, events: Events) {
    this.local = new Storage(SqlStorage);
    // If we navigated to this page, we will have an item available as a nav param
    this.nav = nav;
    this.login = {};
    this.data = {};
    // this.payloaddata = {};
    this.data.response = '';
    this.data.site
    this.http = http;
    this.submitted = false;
    this.unitetoast = unitetoast;
    this.events = events;
    this.loaderconfig = {content: 'Please wait...'}
  }
  onPageDidEnter() {
    // the left menu should be disabled on the login page
    this.menu.enable(false);
  }

  onPageDidLeave() {
    // enable the left menu when leaving the login page
    this.menu.enable(true);
  }
  onLogin(form) {
    this.submitted = true;
    if (form.valid) {
      this.showLoader();
      this.baseurl = this.login.siteurl;
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      this.payloaddata = 'username=' + this.login.username + '&password=' + this.login.password;
      var link = this.baseurl + '/index.php?option=com_api&app=users&resource=login&format=raw';
      this.http.post(link, this.payloaddata, {
        headers: headers
      })
        .map(res => res.json())
        .subscribe(data => {
          this.hideLoader();
          this.data.response = data;
          let siteConfig = {
            "siteurl": this.login.siteurl,
            "authkey": this.data.response.auth,
            "username": this.login.username,
            "userid": this.data.response.id
          }
          this.local.set('siteConfig', JSON.stringify(siteConfig));
          this.siteconfig.setConfig(siteConfig);
          this.events.publish('login:success', 'siteConfig');
          let nav = this.app.getComponent('nav');
          this.unitetoast.toastOptions.message = "Login Successfully";
          this.unitetoast.showToast();
          nav.setRoot(ListPage);
        }, error => {
          this.unitetoast.toastOptions.message = "Username and password do not match or you do not have an account yet.";
          this.unitetoast.showToast();
        });
    } else {
      this.unitetoast.toastOptions.message = "Please enter valid data";
      this.unitetoast.showToast();
    }
  }

  demoLogin() {
    this.login.siteurl = "http://demo.appcarvers.com/junite";
    this.login.username = "admin";
    this.login.password = "junite1234";
  }
   showLoader() {
		this.loader = Loading.create(this.loaderconfig);
		this.nav.present(this.loader);
	}
	hideLoader() {
		setTimeout(() => {
			this.loader.dismiss();
		})
	}

}

