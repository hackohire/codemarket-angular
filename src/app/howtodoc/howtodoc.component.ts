import { Component, OnInit } from '@angular/core';
import { PostType } from '../shared/models/post-types.enum';

@Component({
  selector: 'app-howtodoc',
  templateUrl: './howtodoc.component.html',
  styleUrls: ['./howtodoc.component.scss']
})
export class HowtodocComponent implements OnInit {

  navLinks = [];
  constructor() {
    this.navLinks = [
      // {
      //   path: 'howtodoc-list',
      //   label: 'How-to-Guide List'
      // },
      {
        path: 'howtodoc-list',
        label: 'How-to-Guide List',
        queryParams: {type: PostType.Design, all: false}
      },
      {
        path: 'add-howtodoc',
        label: 'Add How-to-Guide'
      }
    ];
  }

  ngOnInit() {
  }

}
