import { Component, OnInit } from '@angular/core';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user/user.service';
import { User } from 'src/app/shared/models/user.model';
import { Observable } from 'rxjs';
import { VideoChatComponent } from 'src/app/video-chat/video-chat.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  breadcumb: BreadCumb;
  navLinks = [];
  anonymousAvatar = require('src/assets/images/anonymous-avatar.jpg');
  codemarketBucketURL = environment.codemarketFilesBucket;
  authorId: string;

  userData$: Observable<User>;

  constructor(
    public authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private dialog: MatDialog
  ) {

    this.breadcumb = {
      title: 'Profile',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'My Profile'
        }
      ]
    };
  }

  ngOnInit() {
    this.authorId = this.activatedRoute.snapshot.params['authorId'];

    // If user is visitng somebody else's profile
    if (this.authorId) {
      this.userData$ = this.userService.getUserById(this.authorId);
    } else {
      this.userData$ = this.authService.loggedInUser$;
    }
    this.createTabs();
  }

  createTabs() {
    this.navLinks = [
      {
        path: 'products-list',
        label: 'Sell'
      },
      {
        path: 'help-request-list',
        label: 'Request Help'
      },
    ];

    // If user is visiting somebody else's profile don't show what other user has bought
    if (!this.authorId) {
      this.navLinks.push(
        {
          path: 'purchased-items-list',
          label: 'Buy'
        },
        {
          path: 'membership-list',
          label: 'Membership'
        }
      );
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(VideoChatComponent, {
      width: '550px',
      data: {authorId: this.authorId},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

}
