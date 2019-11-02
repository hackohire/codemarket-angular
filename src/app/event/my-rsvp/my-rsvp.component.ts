import { Component, OnInit, ViewChild } from '@angular/core';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { Event } from '../../shared/models/event.model';
import { PostService } from '../../shared/services/post.service';
import { AuthService } from '../../core/services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/state/app.state';
import { selectLoggedInUser } from '../../core/store/selectors/user.selector';
import { map, tap, switchMap } from 'rxjs/operators';
import { MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-my-rsvp',
  templateUrl: './my-rsvp.component.html',
  styleUrls: ['./my-rsvp.component.scss']
})
export class MyRsvpComponent implements OnInit {

  breadcumb: BreadCumb;
  myRSVPEvents: Event[] = [];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource = new MatTableDataSource();
  displayedColumns = ['number', 'name', 'from', 'to', 'host', 'action'];

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
    this.dataSource.sort = this.sort;
    this.store.select(selectLoggedInUser).pipe(
      switchMap((u) => {
        if (u) {
          return this.postService.myRSVP(u._id);
        }
      }),
      tap((u) => {
        console.log(u);
        /** Set the data for the datatable  */
        this.dataSource.data = [...u];

        /** Set the columns visible in the table */
        // this.displayedColumns = ['number', 'name', 'price', 'createdBy', 'type', 'category', 'createdAt'];
      })
    ).subscribe();
  }

  cancelRSVP(eventId: string) {
    this.postService.cancelRSVP(eventId).subscribe((e) => {
      console.log(e);
      if (e && e.usersAttending && e.usersAttending) {
        const isCustomerGoing = e.usersAttending.find(u => u._id === this.authService.loggedInUser._id);
        if (!isCustomerGoing) {
          this.dataSource.data = this.dataSource.data.filter((e: Event) => e._id !== eventId);
        }
      }
    });
  }

}
