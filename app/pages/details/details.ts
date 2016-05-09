import {Page, NavController, NavParams} from 'ionic-angular';
import {UniteList} from '../../unite-framework/unitelist';

@Page({
  templateUrl: 'build/pages/details/details.html',
   providers: [UniteList]
})

export class DetailsPage {
	selectedItem: any;
	items: any;
	unitelist: any;
	constructor(private nav: NavController, navParams: NavParams, unitelist: UniteList) {
		// If we navigated to this page, we will have an item available as a nav param
		this.selectedItem = navParams.get('item');
		// API Definitions
		this.unitelist = unitelist;
		//this.unitelist.url = 'http://172.132.45.138/ekstep/index.php?app=jlike&resource=annotations&option=com_api&format=raw&key=ed086fefc3b111c666378912f44d71ca0a70a8b6&content_id=17&type=annotation&subtype=collaborators&client=com_ekcontent&plg_type=content&plg_name=jlike_ekcontent&order=DESC&parent_id='+this.selectedItem.annotation_id;
		this.unitelist.url = 'http://jlike.cloudaccess.host/index.php?app=jlike&resource=annotations&option=com_api&format=raw&key=87aa58a73cc77f31411d226202e4a6b0&content_id=1&type=annotation&subtype=collaborators&client=com_content&plg_type=content&plg_name=jlike_articles&order=DESC&parent_id=0';
		this.unitelist.limit = 10;
		// Loader Config
		this.unitelist.loaderconfig.content = 'Hold Tight!';
		this.loadData();
	}
	
	loadData() {
		this.unitelist.getData().then((value: any) => {
			//this.items = this.items.concat(value.data.results);
			console.log(value);
		});
		
	}
	
}

