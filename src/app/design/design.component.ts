import { Component, OnInit } from '@angular/core';
import { PostType } from '../shared/models/post-types.enum';

@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.scss']
})
export class DesignComponent implements OnInit {

  navLinks = [];
  constructor() {
    this.navLinks = [
      // {
      //   path: 'design-list',
      //   label: 'Design  List'
      // },
      {
        path: 'post-list',
        label: 'Design  List',
        queryParams: {type: PostType.Design}
      },
      {
        path: 'add-design',
        label: 'Add Design '
      }
    ];
  }

  ngOnInit() {

  }

}
