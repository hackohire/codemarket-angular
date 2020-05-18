import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../core/store/state/app.state';
import { Observable, of } from 'rxjs';
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
import { FormGroup, Validators, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { FormBuilderService } from '../form-builder/form-builder.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  questionnaire: FormGroup;
  fields = [
    {
      name: 'firstName',
      label: 'Enter your First Name*',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      label: 'Enter your Last Name',
      type: 'text',
      required: false,
    },
    {
      name: 'email',
      label: 'Enter your Email*',
      type: 'email',
      required: false,
    },
    {
      name: 'phone',
      label: 'Enter your Phone Number(10 Digits)*',
      type: 'number',
      required: true,
    },
    {
      name: 'businessName',
      label: 'Enter your Business Name*',
      type: 'text',
      required: true,
    },
    {
      name: 'address',
      label: 'Enter your Address*',
      type: 'text',
      required: true,
    }
  ];

  @ViewChild('successInvitationAccept', { static: false }) successInvitationAccept: SwalComponent;
  productsList$: Observable<Product[]>;
  helpRequestList$: Observable<HelpQuery[]>;
  usersListAndTheirBugFixes$: Observable<[]>;

  emailInput: string;

  displayedColumnsForHelpRequest: string[] = ['number', 'name', 'price', 'createdBy', 'createdAt'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private userService: UserService,
    public postService: PostService,
    public authService: AuthService,
    private formBuilderService: FormBuilderService,
    private membershipService: MembershipService,
    private activatedRoute: ActivatedRoute,
    private el: ElementRef,
  ) {
  }

  ngOnInit() {

    this.questionnaire = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl(''),
      email: new FormControl('', [Validators.email, Validators.required]),
      phone: new FormControl('', [Validators.minLength(10), Validators.maxLength(10), Validators.required]),
      businessName: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required)
    });
  }

  convertObjectToArray(d) {
    return Object.keys(d);
  }

  redirectToUserProfile(event) {
    console.log(event);
    this.userService.redirectToUserProfile(event);
  }

  submit(stepper) {
    const body = {
      formname: 'Landing Page Form',
      formDataJson: this.questionnaire.value
    }
    this.formBuilderService.addformData(body).subscribe((d: any) => {
      if (d) {
        Swal.fire(`${d.formname} has been Added Successfully`, '', 'success').then(() => {
          this.questionnaire.reset();
          stepper.reset();
          // this.formBuilderService.redirectToBack(d._id);
        });
      }
    });
  }
}
