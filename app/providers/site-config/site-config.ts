import {Injectable, Inject} from 'angular2/core';
// import {NavController, Toast} from 'ionic-angular';

@Injectable()
export class SiteConfig {
	siteConfig: any;
	constructor() {
		this.siteConfig = {};
	}
	setConfig(obj) {
		this.siteConfig = obj;
	}
	getConfig() {
		return this.siteConfig;;
	}

}
