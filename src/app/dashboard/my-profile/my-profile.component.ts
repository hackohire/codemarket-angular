import { Component, OnInit } from '@angular/core';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  breadcumb: BreadCumb;
  navLinks = [];

  constructor() {
    this.breadcumb = {
      title: 'My Profile',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'My Profile'
        }
      ]
    };
  }

  ngOnInit() {
    this.navLinks = [
      {
        path: 'products-list',
        label: 'Sell'
      },
      {
        path: 'help-request-list',
        label: 'Request Help'
      }
    ];
  }

}
