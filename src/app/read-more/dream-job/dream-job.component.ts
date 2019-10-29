import { Component, OnInit } from '@angular/core';
import { BreadCumb } from '../../shared/models/bredcumb.model';

@Component({
  selector: 'app-dream-job',
  templateUrl: './dream-job.component.html',
  styleUrls: ['./dream-job.component.scss']
})
export class DreamJobComponent implements OnInit {

  breadcumb: BreadCumb;
  constructor() {
    this.breadcumb = {
      title: 'Dreamjob',
      path: [
        {
          name: '/dream-job',
          pathString: '/dream-job'
        },
      ]
    };
  }

  ngOnInit() {
  }

}
