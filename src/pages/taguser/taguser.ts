import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { RemoteServiceProvider } from '../../providers/remote-service/remote-service';
import 'rxjs/add/operator/debounceTime';


@IonicPage()
@Component({
  selector: 'page-taguser',
  templateUrl: 'taguser.html',
})
export class TaguserPage {

  searchTerm: string = '';
  searchControl: FormControl;
  searching: any = false;
  selectedTags = [];

  public users: any;
  base_url: any;
  pagename: string = '';
  is_invited: any;
  event_id: any;


  constructor(public navParams: NavParams, public navCtrl: NavController, public remotService: RemoteServiceProvider,
    public viewCtrl: ViewController) {
    this.pagename = this.navParams.get('pagename');
    this.base_url = this.remotService.site_url;
    this.event_id = this.navParams.get('event_id');
    this.searchControl = new FormControl();
  }

  ionViewDidLoad() {

    this.setFilteredItems();

    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {

      this.setFilteredItems();

    });


  }

  setFilteredItems() {

    this.users = [];
    this.searching = true;
    this.selectedTags = [];

    var searchparams = {
      user_id: window.localStorage['userid'],
      token: window.localStorage['token'],
      searchkeyword: this.searchTerm,
      event_id: this.event_id
    };
    this.remotService.postData(searchparams, 'getConnections').subscribe((response) => {
      this.searching = false;
      if (response.success == 1) {
        this.users = response.data;
        this.is_invited = true;

      } else {
        this.remotService.presentToast('Error loading data.');
      }
    }, () => {
      this.searching = false;
      this.remotService.presentToast('Error loading data.');
    });

  }

  /**
   * on chnage checkbox 
   */
  tagThisUser(e: any, item, index) {
    if (e.checked)
      this.selectedTags[index] = item;
    else
      this.selectedTags.splice(index, 1);
    //console.log("User should be tagged", e.checked, this.selectedTags)
  }

  selectThisUser(e: any, item, index) {
    this.selectedTags = [];
    this.selectedTags[index] = item;
    //console.log("User should be tagged", this.selectedTags)
  }
  dismiss() {
    this.viewCtrl.dismiss({ tags: this.selectedTags });

  }

}
