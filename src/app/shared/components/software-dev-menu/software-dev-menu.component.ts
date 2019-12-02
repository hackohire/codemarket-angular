import { Component, OnInit, Input } from '@angular/core';
import { appConstants } from '../../constants/app_constants';

@Component({
  selector: 'app-software-dev-menu',
  templateUrl: './software-dev-menu.component.html',
  styleUrls: ['./software-dev-menu.component.scss']
})
export class SoftwareDevMenuComponent implements OnInit {
  constructor() { }

  icons = appConstants.icons;

  ngOnInit() {
  }

}
