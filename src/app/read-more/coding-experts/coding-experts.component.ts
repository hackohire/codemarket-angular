import { Component, OnInit } from '@angular/core';
import { BreadCumb } from '../../shared/models/bredcumb.model';

@Component({
  selector: 'app-coding-experts',
  templateUrl: './coding-experts.component.html',
  styleUrls: ['./coding-experts.component.scss']
})
export class CodingExpertsComponent implements OnInit {

  breadcumb: BreadCumb;
  constructor() {
    this.breadcumb = {
      title: 'Coding Experts',
      path: [
        {
          name: '/coding-experts',
          pathString: '/coding-experts'
        },
      ]
    };
  }

  ngOnInit() {
  }

}
