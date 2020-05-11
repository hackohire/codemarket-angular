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
import {FormBuilderService} from '../form-builder/form-builder.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { catchError, } from 'rxjs/operators';
import { of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
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
  @ViewChild(MatSort, {static: false}) sort: MatSort;

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

    this.formJsonListSubscription = this.formBuilderService.fetchformJson().subscribe((formJsonlist) => {
      if (formJsonlist && formJsonlist.length) {
        this.form1 = formJsonlist.find(form => form._id === this.connectedFormStructureId).formStructureJSON;
      }
      this.formDetailsInitialization(null);
    });
    // this.store.dispatch(GetAllProducts());
    // this.productsList$ = this.store.select(selectAllProductsList);
    // this.helpRequestList$ = this.postService.getPostsByType(PostType.HelpRequest);
    // this.usersListAndTheirBugFixes$ = this.userService.getUserListWithBugFixesCount();
  }

  redirectToUserProfile(event) {
    console.log(event);
    this.userService.redirectToUserProfile(event);
  }


  formName = '';
  connectedFormStructureId = '';

  formJsonListSubscription: Subscription;
  
  public form1 = {components: []};
  formDetails: FormGroup;
 

  formDetailsInitialization(i: any) {
    this.formDetails = new FormGroup({
      formname: new FormControl(i && i.formname ? i.formname : this.formName, Validators.required),
      formDataJson: new FormControl(i && i.jsonstring ? i.jsonstring : '', Validators.required),
      connectedFormStructureId: new FormControl(i && i._id ? i._id : this.connectedFormStructureId)
    });
  }

  onSubmitForm1(event) {
    console.log(event.data);
    this.formDetails.value.formDataJson = event.data;

    this.formBuilderService.addformData(this.formDetails.value).pipe(
      catchError((e) => {
        console.log(e);
        return of(false);
      })
    ).subscribe((d: any) => {
      if (d) {
        Swal.fire(`${d.formname} has been Added Successfully`, '', 'success').then(() => {
          this.openDialog();
        });
      }
    });
  }



  openDialog() {
    const dialogRef = this.dialog.open(DialogOverviewExample);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


  isBrowser() {
    return isPlatformBrowser(this._platformId);
  }

}


@Component({
  selector: 'dialog-overview-example',
  templateUrl: './dialog-overview-example.html',
})
export class DialogOverviewExample {

  getDetails= '';
  getDetilsConnectedFormStructureId = '';
  formJsonListSubscription1: Subscription;
  public form2 = {components: []};
  formDetailsForm: FormGroup;
  

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExample>,
     private formBuilderService: FormBuilderService,
     @Inject(PLATFORM_ID) private _platformId,
     private router: Router,) {
      this.getDetails = 'Getdetails';
      this.getDetilsConnectedFormStructureId = '5eb409c53a429f353b3d8b0b';
      
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  formDetailsInitializationDetailsForm(i: any) {
    this.formDetailsForm = new FormGroup({
      formname: new FormControl(i && i.formname ? i.formname : this.getDetails, Validators.required),
      formDataJson: new FormControl(i && i.jsonstring ? i.jsonstring : '', Validators.required),
      connectedFormStructureId: new FormControl(i && i._id ? i._id : this.getDetilsConnectedFormStructureId)
    });
  }

  ngOnInit() {
    this.formJsonListSubscription1 = this.formBuilderService.fetchformJson().subscribe((formJsonlist) => {
      if (formJsonlist && formJsonlist.length) {
        this.form2 = formJsonlist.find(form => form._id === this.getDetilsConnectedFormStructureId).formStructureJSON;
      }
      this.formDetailsInitializationDetailsForm(null);
    });
  }

  onSubmitForm(event) {
    console.log(event.data);
    this.formDetailsForm.value.formDataJson = event.data;

    this.formBuilderService.addformData(this.formDetailsForm.value).pipe(
      catchError((e) => {
        console.log(e);
        return of(false);
      })
    ).subscribe((d: any) => {
      if (d) {
        Swal.fire(`${d.formname} has been Added Successfully`, '', 'success').then(() => {
          this.dialogRef.close();
          this.router.navigate(['/', 'program-list']);
        });
      }
    });
  }

  isBrowser() {
    return isPlatformBrowser(this._platformId);
  }

}
