import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { appConstants } from '../../constants/app_constants';

@Component({
  selector: 'app-post-type-nav',
  templateUrl: './post-type-nav.component.html',
  styleUrls: ['./post-type-nav.component.scss']
})
export class PostTypeNavComponent implements OnInit {

  postTypesArray = appConstants.postTypesArray;
  @Input() selectedPostType = '';

  @Output() postTypeClick = new EventEmitter();
  @Output() plusButtonClick = new EventEmitter();

  constructor(
  ) { }

  ngOnInit() {
  }

}
