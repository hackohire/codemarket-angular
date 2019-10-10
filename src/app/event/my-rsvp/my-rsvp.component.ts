import { Component, OnInit } from '@angular/core';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { Event } from '../../shared/models/event.model';
import { PostService } from '../../shared/services/post.service';
import { AuthService } from '../../core/services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/state/app.state';
import { selectLoggedInUser } from '../../core/store/selectors/user.selector';
import { map, tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-my-rsvp',
  templateUrl: './my-rsvp.component.html',
  styleUrls: ['./my-rsvp.component.scss']
})
export class MyRsvpComponent implements OnInit {

  breadcumb: BreadCumb;
  myRSVPEvents: Event[] = [];

  constructor(
    public postService: PostService,
    private authService: AuthService,
    private store: Store<AppState>
  ) {
    this.breadcumb = {
      title: 'List of Events I\'m Attending',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'My Profile',
          // pathString: '/'
        },
        {
          name: 'my-rsvp'
        }
      ]
    };
  }

  ngOnInit() {

    this.store.select(selectLoggedInUser).pipe(
      switchMap((u) => {
        if(u) {
          return this.postService.myRSVP(u._id)
        }
      }),
      tap((u) => this.myRSVPEvents = u)
    ).subscribe();
  }

}
