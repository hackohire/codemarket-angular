import { Component, OnInit } from '@angular/core';
import { BreadCumb } from '../../shared/models/bredcumb.model';

@Component({
  selector: 'app-team-iq',
  templateUrl: './team-iq.component.html',
  styleUrls: ['./team-iq.component.scss']
})
export class TeamIqComponent implements OnInit {

  breadcumb: BreadCumb;
  constructor() {
    this.breadcumb = {
      title: 'Team IQ',
      path: [
        {
          name: '/team-iq',
          pathString: '/team-iq'
        },
      ]
    };
  }

  ngOnInit() {
  }

}
