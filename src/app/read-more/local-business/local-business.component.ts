import { Component, OnInit } from '@angular/core';
import { BreadCumb } from '../../shared/models/bredcumb.model';

@Component({
  selector: 'app-local-business',
  templateUrl: './local-business.component.html',
  styleUrls: ['./local-business.component.scss']
})
export class LocalBusinessComponent implements OnInit {

  breadcumb: BreadCumb;
  constructor() {
    this.breadcumb = {
      title: 'Local Business',
      path: [
        {
          name: '/local-business',
          pathString: '/local-business'
        },
      ]
    };
  }

  ngOnInit() {
  }

}
