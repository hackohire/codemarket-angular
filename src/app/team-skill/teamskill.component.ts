import { Component, OnInit } from '@angular/core';
import { PostType } from '../shared/models/post-types.enum';

@Component({
  selector: 'app-teamskill',
  templateUrl: './teamskill.component.html',
  styleUrls: ['./teamskill.component.scss']
})
export class TeamskillComponent implements OnInit {

  navLinks = [];
  constructor() {
    this.navLinks = [
      // {
      //   path: 'teamskill-list',
      //   label: 'Teamskill List',
      //   queryParams: {type: PostType.Teamskill}
      // },
      {
        path: 'post-list',
        label: 'Teamskill List',
        queryParams: {type: PostType.Teamskill, all: false}
      },
      {
        path: 'add-teamskill',
        label: 'Add Teamskill'
      }
    ];
  }

  ngOnInit() {

  }

}
