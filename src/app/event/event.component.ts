import { Component, OnInit } from '@angular/core';
import { PostType } from '../shared/models/post-types.enum';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {

  navLinks = [];
  constructor() {
    this.navLinks = [
      // {
      //   path: 'event-list',
      //   label: 'Event List',
      //   queryParams: {type: PostType.Event}
      // },
      {
        path: 'post-list',
        label: 'Event List',
        queryParams: {type: PostType.Event, all: false}
      },
      {
        path: 'add-event',
        label: 'Add Event'
      }
    ];
  }

  ngOnInit() {

  }

}
