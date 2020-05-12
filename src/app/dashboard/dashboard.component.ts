import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../core/store/state/app.state';
import { Observable } from 'rxjs';
import { Product } from '../shared/models/product.model';
import { MatTableDataSource } from '@angular/material/table';
import { HelpQuery } from '../shared/models/help-query.model';
import { MatSort } from '@angular/material';
import { UserService } from '../user/user.service';
import { PostService } from '../shared/services/post.service';
import { AuthService } from '../core/services/auth.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { MembershipService } from '../membership/membership.service';
import { Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilderService } from '../form-builder/form-builder.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { catchError, } from 'rxjs/operators';
import { of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('successInvitationAccept', { static: false }) successInvitationAccept: SwalComponent;
  productsList$: Observable<Product[]>;
  helpRequestList$: Observable<HelpQuery[]>;
  usersListAndTheirBugFixes$: Observable<[]>;

  emailInput: string;

  displayedColumnsForHelpRequest: string[] = ['number', 'name', 'price', 'createdBy', 'createdAt'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  formName = '';
  connectedFormStructureId = '';

  formJsonListSubscription: Subscription;

  public form1 = { components: [] };
  formDetails: FormGroup;

  constructor(
    private userService: UserService,
    public postService: PostService,
    public authService: AuthService,
    private membershipService: MembershipService,
    public dialog: MatDialog,
    private formBuilderService: FormBuilderService,
    private activatedRoute: ActivatedRoute,
    @Inject(PLATFORM_ID) private _platformId) {
    this.formName = 'Eligibility';
    this.connectedFormStructureId = '5eb3a8efa83c7d1778526205';
  }

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

  isBrowser() {
    return isPlatformBrowser(this._platformId);
  }

}
