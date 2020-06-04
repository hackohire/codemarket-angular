import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../core/store/state/app.state';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material';
import { UserService } from '../user/user.service';
import { PostService } from '../shared/services/post.service';
import { AuthService } from '../core/services/auth.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { MembershipService } from '../membership/membership.service';
import { Email } from '../shared/models/email.model';
import { EmailValidator } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('successInvitationAccept', { static: false }) successInvitationAccept: SwalComponent;

  salesemailInput: string;
  growsalesemailInput: string;
  step1emailInput: string;
  step2emailInput: string;
  step3emailInput: string;
  TwitteremailInput: string;
  FacebookemailInput: string;
  InstagramemailInput: string;
  LinkedinemailInput: string;
  YoutubeemailInput: string;
  SnapchatemailInput: string;
  PinterestemailInput: string;
  MarketingemailInput: string;


  displayedColumnsForHelpRequest: string[] = ['number', 'name', 'price', 'createdBy', 'createdAt'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private userService: UserService,
    public postService: PostService,
    public authService: AuthService,
    private membershipService: MembershipService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    console.log(this.activatedRoute.snapshot.queryParams);

    const params = this.activatedRoute.snapshot.queryParams;

    if (params && params.subscriptionId && params.email) {
      this.membershipService.acceptInvitation(params.subscriptionId, params.email).subscribe({
        next: (sub) => {
          if (sub && sub.subscriptionUsers && sub.subscriptionUsers.length) {
            this.successInvitationAccept.show();
          }
        }
      });
    }
    // this.store.dispatch(GetAllProducts());
    // this.productsList$ = this.store.select(selectAllProductsList);
    // this.helpRequestList$ = this.postService.getPostsByType(PostType.HelpRequest);
    // this.usersListAndTheirBugFixes$ = this.userService.getUserListWithBugFixesCount();
  }

  redirectToUserProfile(event) {
    console.log(event);
    this.userService.redirectToUserProfile(event);
  }

}
