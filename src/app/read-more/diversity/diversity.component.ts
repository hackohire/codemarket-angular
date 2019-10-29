import { Component, OnInit } from '@angular/core';
import { BreadCumb } from '../../shared/models/bredcumb.model';

@Component({
  selector: 'app-diversity',
  templateUrl: './diversity.component.html',
  styleUrls: ['./diversity.component.scss']
})
export class DiversityComponent implements OnInit {

  breadcumb: BreadCumb;
  constructor() {
    this.breadcumb = {
      title: 'Diversity',
      path: [
        {
          name: '/diversity',
          pathString: '/diersity'
        },
      ]
    };
  }

  ngOnInit() {
  }

}
