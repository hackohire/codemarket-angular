import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-breadcumb',
  templateUrl: './breadcumb.component.html',
  styleUrls: ['./breadcumb.component.scss']
})
export class BreadcumbComponent implements OnInit {

  @Input() title: string;
  @Input() path: [];
  constructor() { }

  ngOnInit() {
  }

}
