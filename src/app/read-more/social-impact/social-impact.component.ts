import { Component, OnInit } from '@angular/core';
import { BreadCumb } from '../../shared/models/bredcumb.model';

@Component({
  selector: 'app-social-impact',
  templateUrl: './social-impact.component.html',
  styleUrls: ['./social-impact.component.scss']
})
export class SocialImpactComponent implements OnInit {

  breadcumb: BreadCumb;
  constructor() {
    this.breadcumb = {
      title: 'Social Impact',
      path: [
        {
          name: '/social-impact',
          pathString: '/social-impact'
        },
      ]
    };
  }

  ngOnInit() {
  }

}
