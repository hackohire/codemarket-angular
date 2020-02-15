import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { appConstants } from '../../constants/app_constants';
import { MatDialog } from '@angular/material/dialog';
import { AddJobComponent } from '../../../job/add-job/add-job.component';
import { PostType, CompanyPostTypes, UserProfilePostTypes } from '../../models/post-types.enum';
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
  companyPostTypes = CompanyPostTypes;
  UserProfilePostTypes = UserProfilePostTypes;

  @Input() label = 'Add';

  @ViewChild('addPostMenu', {static: false}) addPostMenu: MatMenuTrigger;

  ngOnInit() {
  }

  openMenu() {
    this.addPostMenu.openMenu();
  }

  openAddJobDialog(): void {
    const dialogRef = this.dialog.open(AddJobComponent, {
      width: '630px',
      height: '550px',
      maxHeight: '700px',
      panelClass: 'no-padding',
      data: null,
      // disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

}
