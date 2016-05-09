
import {IonicApp, Platform, Page, NavController, NavParams, Storage, LocalStorage, Events, Alert} from 'ionic-angular';
import {ListPage} from '../list/list';
@Page({
   templateUrl: 'build/pages/category/category.html',
})
export class CategoryPage {
    category: any;
    submitted: boolean;
    resultdata: any;
    local: any;
    scannerRes: any;
    platform: any;
    events: any;
    page: any;
    docList: any;
    docs: any;
    updateButton: boolean;
    constructor(private nav: NavController, private app: IonicApp, platform: Platform, events: Events) {
        // If we navigated to this page, we will have an item available as a nav param
        this.nav = nav;
        this.category = {};
        this.page = {};
        this.submitted = false;
        this.local = new Storage(LocalStorage);
        this.scannerRes = [];
        this.platform = platform;
        this.events = events;
        this.docList = [];
        this.updateButton = false;
    }
    category(form) {
        this.submitted = true;
        if (form.valid) {
           console.log("valid");
        } else {
            console.log("not valid");
        }
        return false;
    }
    
    
    itemTapped(event) {
		console.log('item taped');
		this.nav.push(ListPage, {
			
		});
	}
}
