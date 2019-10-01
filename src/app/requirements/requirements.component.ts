import { Component, OnInit } from '@angular/core';
import { PostType } from '../shared/models/post-types.enum';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.scss']
})
export class RequirementsComponent implements OnInit {

  navLinks = [];
  constructor() {
    this.navLinks = [
      // {
      //   path: 'requirements-list',
      //   label: 'Requirements List'
      // },
      {
        path: 'post-list',
        label: 'Requirements List',
        queryParams: {type: PostType.Requirement, all: false}
      },
      {
        path: 'add-requirement',
        label: 'Add Requirement'
      }
    ];
  }

  ngOnInit() {
  }

}
