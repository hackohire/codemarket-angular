import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.scss']
})
export class InterviewComponent implements OnInit {

  navLinks = [];
  constructor() {
    this.navLinks = [
      {
        path: 'interview-list',
        label: 'Interview List'
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
