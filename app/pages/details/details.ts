import {Page, NavController, NavParams} from 'ionic-angular';
import {UniteList} from '../../unite-framework/unitelist';
import {UniteToast} from '../../unite-framework/unitetoast';
import {FallbackDirective} from '../../components/fallback-directive/fallback-directive';
import {SiteConfig} from '../../providers/site-config/site-config';
@Page({
  templateUrl: 'build/pages/details/details.html',
   providers: [UniteList],
   directives: [FallbackDirective]
})

export class DetailsPage {
	selectedItem: any;
	items: any;
	unitelist: any;
	constructor(private nav: NavController, navParams: NavParams, unitelist: UniteList, private siteconfig:SiteConfig) {
		// If we navigated to this page, we will have an item available as a nav param
		this.selectedItem = navParams.get('item');
		// API Definitions
		this.unitelist = unitelist;
		let siteurl = siteconfig.getConfig().siteurl;
		this.unitelist.baseurl = siteurl + '/index.php?option=com_api&app=content&resource=articles&format=raw&lang=en';
		this.unitelist.limit = 10;
		// Loader Config
		this.unitelist.loaderconfig.content = 'Hold Tight!';
		this.loadData();
	}
	
	loadData() {
		this.unitelist.getData().then((value: any) => {
			this.items = this.items.concat(value.data.results);
		});
		
	}
	
	

}

