import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss']
})
export class TestingComponent implements OnInit {

  navLinks = [];
  constructor() {
    this.navLinks = [
      {
        path: 'testing-list',
        label: 'Testing Report List'
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
