import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-goal',
  templateUrl: './goal.component.html',
  styleUrls: ['./goal.component.scss']
})
export class GoalComponent implements OnInit {

  navLinks = [];
  constructor() {
    this.navLinks = [
      {
        path: 'goal-list',
        label: 'Goal List'
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
