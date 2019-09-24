import { Component, OnInit } from '@angular/core';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';

@Component({
  selector: 'app-membership-list',
  templateUrl: './membership-list.component.html',
  styleUrls: ['./membership-list.component.scss']
})
export class MembershipListComponent implements OnInit {

  breadcumb: BreadCumb;
  constructor() { }

  ngOnInit() {
    this.breadcumb = {
      title: 'List of Subscriptions',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'My Profile',
          // pathString: '/'
        },
        {
          name: 'Membership'
        }
      ]
    };
  }

}
