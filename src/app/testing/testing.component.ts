import { Component, OnInit } from '@angular/core';
import { PostType } from '../shared/models/post-types.enum';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss']
})
export class TestingComponent implements OnInit {

  navLinks = [];
  constructor() {
    this.navLinks = [
      // {
      //   path: 'testing-list',
      //   label: 'Testing Report List'
      // },
      {
        path: 'post-list',
        label: 'Testing Report List',
        queryParams: {type: PostType.Testing}
      },
      {
        path: 'add-testing',
        label: 'Add Testing Report'
      }
    ];
  }

  ngOnInit() {

  }

}
