import {Page, NavController, NavParams} from 'ionic-angular';
import {UniteList} from '../../unite-framework/unitelist';
import {ListPage} from '../list/list';
@Page({
	templateUrl: 'build/pages/login/login.html',
	providers: [UniteList],
})

export class LoginPage {
    private login:any;
    private submitted:boolean;
    resultdata:any;  
  constructor(private nav: NavController) {
    // If we navigated to this page, we will have an item available as a nav param
    this.nav = nav;
    this.login = {};
    this.submitted = false;
             
  }
  itemTapped1(event) {        
           console.log("not valid"); 
           this.nav.push(ListPage, {			
		});
    }
    
    
    onLogin(form) {    
     
    this.submitted = true;
    if (form.valid) {        
      this.nav.push(ListPage, {
     });     
    }else{
       console.log("not valid"); 
    }
  }
  }

