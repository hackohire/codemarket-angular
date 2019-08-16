import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.scss']
})
export class RequirementsComponent implements OnInit {

  navLinks = [];
  constructor() {
    this.navLinks = [
      {
        path: 'requirements-list',
        label: 'Requirements List'
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
