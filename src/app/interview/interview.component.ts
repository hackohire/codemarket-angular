import { Component, OnInit } from '@angular/core';
import { PostType } from '../shared/models/post-types.enum';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.scss']
})
export class InterviewComponent implements OnInit {

  navLinks = [];
  constructor() {
    this.navLinks = [
      // {
      //   path: 'interview-list',
      //   label: 'Interview List'
      // },
      {
        path: 'post-list',
        label: 'Interview List',
        queryParams: {type: PostType.Interview, all: false}
      },
      {
        path: 'add-interview',
        label: 'Add Interview'
      }
    ];
  }

  ngOnInit() {

  }

}
