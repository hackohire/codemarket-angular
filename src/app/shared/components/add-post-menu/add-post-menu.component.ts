import { Component, OnInit, Input } from '@angular/core';
import { appConstants } from '../../constants/app_constants';

@Component({
  selector: 'app-add-post-menu',
  templateUrl: './add-post-menu.component.html',
  styleUrls: ['./add-post-menu.component.scss']
})
export class AddPostMenuComponent implements OnInit {
  constructor() { }

  icons = appConstants.icons;

  ngOnInit() {
  }

}
