import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { appConstants } from '../../constants/app_constants';
import { MatDialog } from '@angular/material/dialog';
import { AddJobComponent } from '../../../job/add-job/add-job.component';
import { PostType } from '../../models/post-types.enum';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-add-post-menu',
  templateUrl: './add-post-menu.component.html',
  styleUrls: ['./add-post-menu.component.scss']
})
export class AddPostMenuComponent implements OnInit {
  constructor(private dialog: MatDialog) { }

  icons = appConstants.icons;
  postTypes = PostType;
  postTypesArray = appConstants.postTypesArray;

  @Input() label = 'Add';

  @ViewChild('addPostMenu', {static: false}) addPostMenu: MatMenuTrigger;

  ngOnInit() {
  }

  openMenu() {
    this.addPostMenu.openMenu();
  }
}
