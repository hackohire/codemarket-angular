import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Post } from '../../models/post.model';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-breadcumb',
  templateUrl: './breadcumb.component.html',
  styleUrls: ['./breadcumb.component.scss']
})
export class BreadcumbComponent implements OnInit {

  @Input() title: string;
  @Input() path: [];
  @Input() eventDate: [];
  @Input() postDetails;
  @Input() companyDetails: Company;
  @Input('color') color = 'white';
  @Input('showMenu') showMenu = true;
  @Input('showEditPostDetails') showEditPostDetails: boolean;

  @Output() editPost = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
