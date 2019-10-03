import { Component, OnInit } from '@angular/core';
import { PostType } from '../shared/models/post-types.enum';

@Component({
  selector: 'app-goal',
  templateUrl: './goal.component.html',
  styleUrls: ['./goal.component.scss']
})
export class GoalComponent implements OnInit {

  navLinks = [];
  constructor() {
    this.navLinks = [
      // {
      //   path: 'goal-list',
      //   label: 'Goal List',
      //   queryParams: {type: PostType.Goal}
      // },
      {
        path: 'post-list',
        label: 'Goal List',
        queryParams: {type: PostType.Goal, all: false}
      },
      {
        path: 'add-goal',
        label: 'Add Goal'
      }
    ];
  }

  ngOnInit() {

  }

}
