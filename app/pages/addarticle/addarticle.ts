import {Page, NavController, NavParams, Alert, IonicApp, Loading} from 'ionic-angular';
import {UniteItem} from '../../unite-framework/uniteitem';
import {UniteToast} from '../../unite-framework/unitetoast';
import {ListPage} from '../list/list';
import {NgZone} from 'angular2/core';
import {SiteConfig} from '../../providers/site-config/site-config';
import {ImageUpload} from '../../unite-framework/image-upload';
@Page({
    templateUrl: 'build/pages/addarticle/addarticle.html'
})
export class AddArticlePage {
    image: string;
    file: string;
    loading: Loading;
    progress: number = 0;
    addarticle: any;
    submitted: boolean;
    resultdata: any;
    local: any;
    items: any;
    updateButton: boolean;
    baseurl: string;
    uniteItem: UniteItem;
    selectedItem: any;
    noitem: boolean;
    datatobesend:string;
    uniteToast: UniteToast;
    constructor(private nav: NavController, uniteItem: UniteItem, uniteToast: UniteToast, private app: IonicApp, private zone: NgZone, private siteconfig: SiteConfig, private imageupload: ImageUpload) {
        // If we navigated to this page, we will have an item available as a nav param
        this.nav = nav;
        this.addarticle = {};
        this.submitted = false;
        this.updateButton = false;
        this.uniteItem = uniteItem;
        this.uniteToast = uniteToast;
        this.noitem = true;
        this.items = [];
        let date = new Date();
        let FromDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        this.addarticle.published = FromDate;
        this.loadData();
    }
    loadData() {
        let url = this.siteconfig.getConfig().siteurl + '/index.php?option=com_api&app=categories&resource=categories&format=raw&lang=en&key=' + this.siteconfig.getConfig().authkey;
        this.uniteItem.getData(url).then((value: any) => {
            if (value) {
                this.items = value;
            }
        });
    }

    postData() {
        let url = this.siteconfig.getConfig().siteurl + '/index.php?option=com_api&app=content&resource=articles&format=raw&lang=en&key=' + this.siteconfig.getConfig().authkey;
        this.uniteItem.postData(url, this.datatobesend).then((value: any) => {
            this.zone.run(() => {
                if (value) {
                    if (value == 'Error') {
                        this.uniteToast.toastOptions.message = "Something went wrong!";
                        this.uniteToast.showToast();
                    } else if (value.success == 'false') {
                        this.uniteToast.toastOptions.message = value.message;
                        this.uniteToast.showToast();
                    }
                    else if (value.success) {
                        this.uniteToast.toastOptions.message = "Added successfully";
                        this.uniteToast.showToast();
                        let nav = this.app.getComponent('nav');
                        nav.setRoot(ListPage);
                    }
                }
            });

        });

    }
    // For single select image
    openAlbums = (): void => {
        this.imageupload.albums.open().then((imageUrl) => {
            if (imageUrl) {
                this.image = imageUrl;
            }
        });
    }
    openCamera = (): void => {
        this.imageupload.camera.open().then((imageUrl) => {
            if (imageUrl) {
                this.image = imageUrl;

            }
        });
    }
    success = (result: any): void => {
        let file = JSON.parse(result.response);
        this.datatobesend += '&intro_image=' + file.filepath + '&full_image=' + file.filepath;
        this.postData();
        this.loading.dismiss();
    }

    failed = (err: any): void => {
        this.loading.dismiss();
        var code = err.code;
        alert("Failed to upload image. Code: " + code);
    }

    onProgress = (progressEvent: ProgressEvent): void => {
        if (progressEvent.lengthComputable) {
            var progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            this.setProgress(progress);
        }
    }

    setProgress = (progress: number): void => {
        this.progress = progress;
    }
   
    upload = (image: string): void => {
        this.loading = Loading.create({
            content: 'Please wait...'
        });
        this.nav.present(this.loading);
        // this.imageupload.file.upload("http://172.132.45.153/joomla3.4_api/index.php?option=com_api&app=content&resource=upload&format=raw&lang=en&key=a2d3ca11a77374b296ef06a1e20a9ea4", image, this.success, this.failed, this.onProgress);
        this.imageupload.file.upload(this.siteconfig.getConfig().siteurl + "/index.php?option=com_api&app=content&resource=upload&format=raw&lang=en&key=" + this.siteconfig.getConfig().authkey, image, this.success, this.failed, this.onProgress);
    }
    submitData(form) {
        this.submitted = true;
        if (form.valid) {
            let title = this.addarticle.articlename;
            let introtext = this.addarticle.introtext;
            let fulltext = this.addarticle.fulltext;
            let catid = this.addarticle.cat;
            let published = this.addarticle.published;
            let unpublished = this.addarticle.unpublished;
            let state = 1;
            let date = new Date();
            let FromDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);

            if (published < FromDate) {
                this.uniteToast.toastOptions.message = "Enter valid Start publishing date";
                this.uniteToast.showToast();
            } else if (published > unpublished) {
                this.uniteToast.toastOptions.message = "Start publishing date should be greater than Finish publishing date";
                this.uniteToast.showToast();
            } else {
                this.datatobesend = 'title=' + title + '&introtext=' + introtext + '&fulltext=' + fulltext + '&catid=' + catid + '&publish_up=' + published + '&publish_down=' + unpublished + '&state=' + state;
                if(this.image){
                    this.upload(this.image);  
                }else{
                    this.postData();
                }
            }
        } else {
            this.uniteToast.toastOptions.message = "Please enter all required data";
            this.uniteToast.showToast();

        }
    }

}
