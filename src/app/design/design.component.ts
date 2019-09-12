import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.scss']
})
export class DesignComponent implements OnInit {

  navLinks = [];
  constructor() {
    this.navLinks = [
      {
        path: 'design-list',
        label: 'Design  List'
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
