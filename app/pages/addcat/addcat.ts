
import {Page, NavController, NavParams, Storage, LocalStorage, Events, Alert, IonicApp, Loading} from 'ionic-angular';
import {UniteItem} from '../../unite-framework/uniteitem';
import {UniteToast} from '../../unite-framework/unitetoast';
import {ListPage} from '../list/list';
import {NgZone} from 'angular2/core';
import {SiteConfig} from '../../providers/site-config/site-config';
@Page({
    templateUrl: 'build/pages/addcat/addcat.html'
})
export class AddCatPage {
    addcat: any;
    submitted: boolean;
    resultdata: any;
    local: any;
    platform: any;
    events: any;
    pages: any;
    updateButton: boolean;
    uniteItem: UniteItem;
    unitetoast: UniteToast;
    loader: Loading;
    loaderconfig:any;
    constructor(private nav: NavController, events: Events, uniteItem: UniteItem, private app: IonicApp, private zone: NgZone, unitetoast: UniteToast, private siteconfig: SiteConfig) {
        // If we navigated to this page, we will have an item available as a nav param
        this.nav = nav;
        this.addcat = {};
        this.submitted = false;
        this.local = new Storage(LocalStorage);
        this.pages = [];
        this.uniteItem = uniteItem;
        this.events = events;
        this.loaderconfig = {content:'Plese wait...'}
        this.unitetoast = unitetoast;
    }
    postData(form) {
        this.submitted = true;
        if (form.valid) {
            this.showLoader();
            let title = this.addcat.catname;
            let description = this.addcat.fulltext;
            let siteurl = this.siteconfig.getConfig().siteurl;
            let authkay = this.siteconfig.getConfig().authkey;
            let datatobesend = 'title=' + title + '&description=' + description;
            let url = siteurl + '/index.php?option=com_api&app=categories&resource=categories&format=raw&lang=en&key=' + authkay;
            this.uniteItem.postData(url, datatobesend).then((value: any) => {
                this.hideLoader();
                this.zone.run(() => {
                    if (value) {
                        if (value == 'Error') {
                            this.unitetoast.toastOptions.message = "Something went wrong!";
                            this.unitetoast.showToast();
                        } else if (value.success && value.success == 'false') {
                            this.unitetoast.toastOptions.message = "Something went wrong!";
                            this.unitetoast.showToast();
                        }
                        else {
                            this.unitetoast.toastOptions.message = "Category added successfully";
                            this.unitetoast.showToast();
                            this.events.publish('page:added', 'Page Added');
                            let nav = this.app.getComponent('nav');

                            //nav.setRoot(ListPage, {item: value.category_id},{item: value.title} );
                            //To avoid empty view redirect all article list
                            nav.setRoot(ListPage);
                        }
                    }
                });
            });
        } else {
            this.unitetoast.toastOptions.message = "Please enter all required data";
            this.unitetoast.showToast();
        }
    }

    cancleAddCat(event) {
        let nav = this.app.getComponent('nav');
        nav.setRoot(ListPage);
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
