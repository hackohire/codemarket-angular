import { Component, OnInit } from '@angular/core';
import { BreadCumb } from '../shared/models/bredcumb.model';

@Component({
  selector: 'app-wellness',
  templateUrl: './wellness.component.html',
  styleUrls: ['./wellness.component.scss']
})
export class WellnessComponent implements OnInit {

  breadcumb: BreadCumb;
  constructor() {
    this.breadcumb = {
      title: 'Wellness',
      path: [
        {
          name: '/wellness',
          pathString: '/wellness'
        },
      ]
    };
  }

  ngOnInit() {
  }

}
