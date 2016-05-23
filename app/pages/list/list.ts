import {Page, NavController, NavParams, LocalStorage, Storage, SqlStorage} from 'ionic-angular';
import {UniteList} from '../../unite-framework/unitelist';
import {DetailsPage} from '../details/details';
import {GettingStartedPage} from '../getting-started/getting-started';
import {UniteToast} from '../../unite-framework/unitetoast';
import {UniteItem} from '../../unite-framework/uniteitem';
import {FallbackDirective} from '../../components/fallback-directive/fallback-directive';
import {SiteConfig} from '../../providers/site-config/site-config';
@Page({
	templateUrl: 'build/pages/list/list.html',
	providers: [UniteList],
	directives: [FallbackDirective]
})

export class ListPage {
	selectedItem: any;
	selectedtitle: string;
	icons: string[];
	items: any;
	unitelist: any;
	baseurl: string;
	searchQuery: string;
	enableSearchbar: boolean;
	enablePullToRefresh: boolean;
	enableifinitescroll: boolean;
	noitem: boolean;
	infinitescroll: any;
	uniteitem: any;
	unitetoast: any;
	local: any;

	constructor(private nav: NavController, navParams: NavParams, unitelist: UniteList, uniteitem: UniteItem, unitetoast: UniteToast, private siteconfig: SiteConfig) {
		// If we navigated to this page, we will have an item available as a nav param
		this.selectedItem = navParams.get('item');
		this.selectedtitle = navParams.get('title');
		this.items = [];
		// API Definitions
		this.unitetoast = unitetoast;
		this.unitelist = unitelist;
		this.uniteitem = uniteitem;
		this.unitelist.limit = 10;
		this.searchQuery = '';
		this.enableSearchbar = true;
		this.enablePullToRefresh = true;
		this.enableifinitescroll = false;
		this.noitem = true;
		this.local = new Storage(SqlStorage);
		// Loader Config
		if (this.selectedItem) {
			this.unitelist.id = this.selectedItem;
		}
		this.unitelist.loaderconfig.content = 'Hold Tight!';
		let config = this.siteconfig.getConfig();
		this.unitelist.baseurl = config.siteurl + '/index.php?option=com_api&app=content&resource=articles&format=raw&lang=en';
		this.loadData(null);
	}
	loadData(infiniteScroll) {
		if (infiniteScroll) {
			if (infiniteScroll.state == 'refreshing') {
				if (this.infinitescroll) {
					this.infinitescroll.enable(true);
				}
			} else {
				this.infinitescroll = infiniteScroll;
			}
		}
		this.unitelist.getData().then((value: any) => {
			if (value) {
				if (value == 'Error') {
					this.unitetoast.toastOptions.message = "Something went wrong!";
					this.unitetoast.showToast();
				} else if (value.success && value.success == 'false') {
					this.unitetoast.toastOptions.message = value.message;
					this.unitetoast.showToast();
				}
				this.noitem = value.success;
			}
			if (value.data) {
				this.items = this.items.concat(value.data.results);
				this.enableifinitescroll = true;
				this.noitem = value.success;
			}
			if (infiniteScroll) {
				infiniteScroll.complete();
				if (!value.data) {
					infiniteScroll.enable(false);
					this.enableifinitescroll = false;
				}
			}
		});

	}
	getItems(searchbar) {
		//let q = searchbar.value;
		this.enableifinitescroll = false;
		if (this.searchQuery) {
			this.unitelist.limitstart = 0;
			this.unitelist.search = this.searchQuery;
			this.items = [];
			this.loadData(null);
		} else {
			this.unitelist.search = '';
		}
	}
	doRefresh(refresher) {
		this.unitelist.limitstart = 0;
		this.items = [];
		this.loadData(refresher);
	}
	clearSearch() {
		this.unitelist.search = '';
		this.unitelist.limitstart = 0;
		this.items = [];
		this.loadData(null);
	}
	itemTapped(event, item) {
		this.nav.push(DetailsPage, {
			item: item
		});
	}

}
