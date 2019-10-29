import { Component, OnInit } from '@angular/core';
import { BreadCumb } from '../../shared/models/bredcumb.model';

@Component({
  selector: 'app-government',
  templateUrl: './government.component.html',
  styleUrls: ['./government.component.scss']
})
export class GovernmentComponent implements OnInit {

  breadcumb: BreadCumb;
  constructor() {
    this.breadcumb = {
      title: 'Government',
      path: [
        {
          name: '/government',
          pathString: '/government'
        },
      ]
    };
  }

  ngOnInit() {
  }

}
