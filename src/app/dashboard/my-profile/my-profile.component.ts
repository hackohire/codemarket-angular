import { Component, OnInit } from '@angular/core';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../user/user.service';
import { User } from '../../shared/models/user.model';
import { Observable } from 'rxjs';
import { VideoChatComponent } from '../../video-chat/video-chat.component';
import { MatDialog } from '@angular/material';
import Peer from 'peerjs';
import { PostType } from '../../shared/models/post-types.enum';

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

  peer: Peer;

  constructor(
    public authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router
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

    /** Peer Subscription for Video Call */
    this.userService.peer.subscribe((p) => {
      if (p) {
        console.log(p);
        this.peer = p;
      }
    });
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

    this.userService.peer.subscribe((p) => {
      if (p) {
        console.log(p);
        this.peer = p;
      }
    });
  }

  createTabs() {
    // this.navLinks = [ ];

    // If user is visiting somebody else's profile don't show what other user has bought
    if (!this.authorId) {
      this.navLinks.push(
        {
          path: 'purchased-items-list',
          label: 'Buy'
        },
        {
          path: 'products-list',
          label: 'Sell'
        },
        {
          path: 'membership-list',
          label: 'Membership'
        },
        {
          path: 'my-rsvp',
          label: 'My RSVP'
        }
      );
      this.router.navigate(['purchased-items-list'], {relativeTo: this.activatedRoute})
    } else {
      this.navLinks.push(
        {
          path: 'products-list',
          label: 'Sell'
        },
        {
          path: 'post-list',
          label: 'Request Help',
          queryParams: {type: PostType.HelpRequest, all: false}
        },
      );
      this.router.navigate(['products-list'], {relativeTo: this.activatedRoute})
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(VideoChatComponent, {
      width: '550px',
      data: { authorId: this.authorId, peer: this.peer },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

}
