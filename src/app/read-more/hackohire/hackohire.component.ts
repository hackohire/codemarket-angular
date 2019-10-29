import { Component, OnInit } from '@angular/core';
import { BreadCumb } from '../../shared/models/bredcumb.model';

@Component({
  selector: 'app-hackohire',
  templateUrl: './hackohire.component.html',
  styleUrls: ['./hackohire.component.scss']
})
export class HackohireComponent implements OnInit {

  breadcumb: BreadCumb;
  constructor() {
    this.breadcumb = {
      title: 'Hackhohire',
      path: [
        {
          name: '/hackohire',
          pathString: '/hackohire'
        },
      ]
    };
  }

  ngOnInit() {
  }

}
