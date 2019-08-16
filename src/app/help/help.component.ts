import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  navLinks = [];
  constructor() {
    this.navLinks = [
      {
        path: 'help-request-list',
        label: 'Help Request List'
      },
      {
        path: 'add-help-request',
        label: 'Add Help Request'
      }
    ];
  }

  ngOnInit() {
  }

}
