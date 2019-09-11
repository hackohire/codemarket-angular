import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-howtodoc',
  templateUrl: './howtodoc.component.html',
  styleUrls: ['./howtodoc.component.scss']
})
export class HowtodocComponent implements OnInit {

  navLinks = [];
  constructor() {
    this.navLinks = [
      {
        path: 'howtodoc-list',
        label: 'How-to-Guide List'
      },
      {
        path: 'add-howtodoc',
        label: 'Add How-to-Guide'
      }
    ];
  }

  ngOnInit() {
  }

}
