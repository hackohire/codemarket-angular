import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { appConstants } from '../../constants/app_constants';
import { PostType } from '../../models/post-types.enum';
import { MatMenuTrigger } from '@angular/material/menu';
import { PostService } from '../../services/post.service';
import { MatDrawer } from '@angular/material';

@Component({
  selector: 'app-add-post-menu',
  templateUrl: './add-post-menu.component.html',
  styleUrls: ['./add-post-menu.component.scss']
})
export class AddPostMenuComponent implements OnInit {
  constructor(
    public postService: PostService
  ) { }

  icons = appConstants.icons;
  postTypes = PostType;
  postTypesArray = appConstants.postTypesArray;

  @Input() label = 'Add';

  @Input() drawer: MatDrawer;

  @ViewChild('addPostMenu', { static: false }) addPostMenu: MatMenuTrigger;

  ngOnInit() {
  }

  openMenu() {
    this.addPostMenu.openMenu();
  }
}
