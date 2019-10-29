import { Component, OnInit } from '@angular/core';
import { BreadCumb } from '../../shared/models/bredcumb.model';

@Component({
  selector: 'app-startups',
  templateUrl: './startups.component.html',
  styleUrls: ['./startups.component.scss']
})
export class StartupsComponent implements OnInit {

  breadcumb: BreadCumb;
  constructor() {
    this.breadcumb = {
      title: 'Startups',
      path: [
        {
          name: '/startups',
          pathString: '/startups'
        },
      ]
    };
  }

  ngOnInit() {
  }

}
