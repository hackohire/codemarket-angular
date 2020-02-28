import { Component, OnInit } from '@angular/core';
import { PostType } from '../shared/models/post-types.enum';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  navLinks = [];
  constructor() {
    this.navLinks = [
      {
        path: 'post-list',
        label: 'Help Request List',
        queryParams: {type: PostType.HelpRequest, all: false}
      },
      // {
      //   path: 'help-request-list',
      //   label: 'Help Request List'
      // },
      {
        path: 'add-help-request',
        label: 'Add Help Request'
      }
    ];
  }

  ngOnInit() {
  }

}
