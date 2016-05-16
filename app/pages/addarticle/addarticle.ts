
import {Page, NavController, NavParams, Storage, LocalStorage, Events, Alert,IonicApp} from 'ionic-angular';
import {UniteItem} from '../../unite-framework/uniteitem';
import {UniteToast} from '../../unite-framework/unitetoast';
import {ListPage} from '../list/list';
import {NgZone} from 'angular2/core';
@Page({
    templateUrl: 'build/pages/addarticle/addarticle.html',
    providers: [UniteItem,UniteToast]
})
export class AddArticlePage {
    addarticle: any;
    submitted: boolean;
    resultdata: any;
    local: any;
    scannerRes: any;
    platform: any;
    events: any;
    pages: any;
    updateButton: boolean;
    baseurl: string;
    uniteitem:any;
    items: any;
    selectedItem: any;
    
    constructor(private nav: NavController, events: Events, private UniteItem: UniteItem, private UniteToast: UniteToast, private app: IonicApp, private zone:NgZone) {
        // If we navigated to this page, we will have an item available as a nav param
        this.nav = nav;
        this.addarticle = {};
        this.submitted = false;
        this.local = new Storage(LocalStorage);
        this.scannerRes = [];
        this.events = events;
        this.updateButton = false;
        this.pages = [];
        //UniteItem.getMenu().then((value) => {
         //   this.getCustomPage(value);
        //});
        
        //this.selectedItem = navParams.get('item');
		this.items = [];
        this.uniteitem = uniteitem;
        this.uniteitem.baseurl = 'http://172.132.45.45/joomla/investsure/index.php?option=com_api&app=content&resource=articles&format=raw&key=62edf1d7654d77cc424ca8e5ea8a1140';
			console.log(this.uniteitem.baseurl);
        
    }
    getCustomPage(pages) {
        this.pages = [];
        for (let i = 0; i < pages.length; i++) {
            if (pages[i].addedMenu) {
                this.pages.push(pages[i]);
            }
        }
    }
    addArticle(form) {
        this.submitted = true;
        if (form.valid) {
        console.log("###########");
            this.events.publish('page:added', this.addarticle);
            //this.UniteItem.getMenu().then((value) => {
            //    this.getCustomPage(value);
            //});
        } else {
        }
        return false;
    }
    removeMenu(index) {
        let confirm = Alert.create({
            title: 'Configure',
            message: 'Do you want to delete it?',
            buttons: [
                {
                    text: 'No',
                    handler: () => {
                        console.log('No clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.pages.splice(index, 1);
                        this.events.publish('page:removed', index);
                    }
                }
            ]
        });
        this.nav.present(confirm);
    }
    editMenu(index, item) {
        this.addarticle.menuname = item.title;
        this.addarticle.component = item.component;
        this.addarticle.index = index;
        this.updateButton = true;
    }
    
    postData(form){
    this.submitted = true;
    if (form.valid) {     
    let title = this.addarticle.articlename;
    let introtext = this.addarticle.introtext;
    let catid = this.addarticle.cat;
    let published = this.addarticle.published;
    let unpublished = this.addarticle.unpublished;
		let datatobesend =  'title='+title+'&introtext='+introtext+'&catid='+catid+'&published='+published+'&unpublished='+unpublished;
		let url = 'http://172.132.45.45/joomla/investsure/index.php?option=com_api&app=content&resource=articles&format=raw&key=62edf1d7654d77cc424ca8e5ea8a1140';
		this.UniteItem.postData(url,datatobesend).then((value: any) => {
		 this.zone.run(() => {
			if(value){
				if(value == 'Error'){
					this.UniteToast.toastOptions.message = "Something went wrong!";
					this.UniteToast.showToast();
				}else if(value.success && value.success == 'false'){
					this.UniteToast.toastOptions.message = value.message;
					this.UniteToast.showToast();
				}
				else
				{
					let nav = this.app.getComponent('nav');
					nav.setRoot(ListPage);
				}
			}
          });
			
		});
	}else{
			console.log("invalid");
		}
	}
    
    
    
    
    updateMenu(form) {
        this.submitted = true;
        if (form.valid) {
            this.events.publish('page:updated', this.addarticle);
          //  this.UniteItem.getMenu().then((value) => {
            //    this.getCustomPage(value);
            //    this.updateButton = false;
            //    this.addarticle = {};
            //    this.submitted = false;
           // });
        } else {
            console.log("not valid");
        }
        return false;
    }

}
