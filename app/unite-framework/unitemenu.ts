import {Injectable, Inject} from 'angular2/core';
@Injectable()
export class UniteMenu {
  pages: any;
  menuMap: any;
  
  constructor() {

  }
  
  getMenu() {
	return this.pages;
  }

  addMemu() {}
  
  removeMenu() {}
  
}

