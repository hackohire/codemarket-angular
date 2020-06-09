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
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { FormBuilderService } from '../form-builder/form-builder.service';
import { environment } from '../../environments/environment';

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

  questionnaire: FormGroup;
  showAuth = false;
  currentImage = '../../assets/images/therapy0.png';
  rightTitle = 'Therapy And Therapist In The Post Covid-19 Era';
  rightSubTitle = {
    date: '06/15/2020',
    time: '2PM',
    zoom: 'https://us02web.zoom.us/j/3765532935'
  };
  leftTitle = 'Grow Online Sales For Your Therapy Practise in 30 Days';
  leftSubTitle = '';


  fields = [
    {
      name: 'firstName',
      label: 'Enter your First Name*',
      placeholder: 'Enter your First Name*',
      type: 'text',
      bannerUrl: '../../assets/images/therapy0.png',
      rightTitle: 'Therapy And Therapist In The Post Covid-19 Era',
      rightSubTitle: {
        date: '06/15/2020',
        time: '2PM',
        zoom: 'https://us02web.zoom.us/j/3765532935'
      },
      leftTitle: 'Grow Online Sales For Your Therapy Practise in 30 Days',
      leftSubTitle: '',
      required: true,
    },
    {
      name: 'lastName',
      label: 'Enter your Last Name',
      placeholder: 'Enter your Last Name',
      type: 'text',
      bannerUrl: '../../assets/images/therapy1.png',
      rightTitle: 'Therapy And Therapist In The Post Covid-19 Era',
      rightSubTitle: {
        date: '06/15/2020',
        time: '2PM',
        zoom: 'https://us02web.zoom.us/j/3765532935'
      },
      leftTitle: 'Grow Online Sales For Your Therapy Practise in 30 Days',
      leftSubTitle: 'SALES AUTOMATION',
      required: false,
    },
    {
      name: 'email',
      label: 'Enter your Email*',
      placeholder: 'Enter your Email*',
      type: 'email',
      bannerUrl: '../../assets/images/therapy2.png',
      rightTitle: 'Therapy And Therapist In The Post Covid-19 Era',
      rightSubTitle: {
        date: '06/15/2020',
        time: '2PM',
        zoom: 'https://us02web.zoom.us/j/3765532935'
      },
      leftTitle: 'Grow Online Sales For Your Therapy Practise in 30 Days',
      leftSubTitle: 'RESULTS DELIVERED',
      required: false,
    },
    {
      name: 'phone',
      label: 'Enter your Phone Number(10 Digits)*',
      placeholder: 'Enter your Phone Number(10 Digits)*',
      type: 'number',
      bannerUrl: '../../assets/images/therapy3.png',
      rightTitle: 'Therapy And Therapist In The Post Covid-19 Era',
      rightSubTitle: {
        date: '06/15/2020',
        time: '2PM',
        zoom: 'https://us02web.zoom.us/j/3765532935'
      },
      leftTitle: 'Grow Online Sales For Your Therapy Practise in 30 Days',
      leftSubTitle: 'DATA DRIVEN',
      required: true,
    },
    {
      name: 'businessName',
      label: 'Enter your Business Name*',
      placeholder: 'Enter your Business Name*',
      type: 'text',
      bannerUrl: '../../assets/images/therapy4.png',
      rightTitle: 'Therapy And Therapist In The Post Covid-19 Era',
      rightSubTitle: {
        date: '06/15/2020',
        time: '2PM',
        zoom: 'https://us02web.zoom.us/j/3765532935'
      },
      leftTitle: 'Grow Online Sales For Your Therapy Practise in 30 Days',
      leftSubTitle: 'AI DRIVEN',
      required: true,
    },
    {
      name: 'address',
      label: 'Enter your Address*',
      placeholder: 'Enter your Address*',
      type: 'text',
      bannerUrl: '../../assets/images/therapy4.png',
      required: true,
    },
    {
      name: 'heplRequired',
      label: 'What help do you need with therapists?',
      placeholder: 'What help do you need with therapists?',
      type: 'textarea',
      bannerUrl: '../../assets/images/therapy4.png',
      required: true,
    }
  ];

  displayedColumnsForHelpRequest: string[] = ['number', 'name', 'price', 'createdBy', 'createdAt'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private userService: UserService,
    public postService: PostService,
    public authService: AuthService,
    private membershipService: MembershipService,
    private activatedRoute: ActivatedRoute,
    private formBuilderService: FormBuilderService
  ) { }

  ngOnInit() {
    this.questionnaire = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl(''),
      email: new FormControl('', [Validators.email, Validators.required]),
      phone: new FormControl('', [Validators.minLength(10), Validators.maxLength(10), Validators.required]),
      businessName: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      helpRequired: new FormControl('', Validators.required)
    });
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

  convertObjectToArray(d) {
    return Object.keys(d);
  }

  test(event) {
    console.log("This is ==>" ,event);
    this.currentImage = this.fields[event.selectedIndex].bannerUrl;
    this.rightTitle = this.fields[event.selectedIndex].rightTitle;
    this.rightSubTitle = this.fields[event.selectedIndex].rightSubTitle;
    this.leftTitle = this.fields[event.selectedIndex].leftTitle;
    this.leftSubTitle = this.fields[event.selectedIndex].leftSubTitle;
  }

  submit(stepper) {
    const body = {
      formname: 'Landing Page Form',
      formDataJson: this.questionnaire.value
    };
    this.formBuilderService.addformData(body).subscribe((d: any) => {
      if (d) {
        if (d.formDataJson && d.formDataJson.email && !this.authService.loggedInUser) {

          /** Clearing the form & stepper */
          this.questionnaire.reset();
          stepper.reset();

          this.showAuth = true;
          environment.confirm.email = d.formDataJson.email;
          environment.confirm.name = (d.formDataJson.firstName + ' ' + d.formDataJson.lastName).trim();
          this.authService._authState.next({ state: 'signUp', user: { username: d.formDataJson.email, name: environment.confirm.name } });
        }
        Swal.fire(`Thank You!`, '', 'success').then(() => {
          // this.questionnaire.reset();
          // stepper.reset();
          if (!this.authService.loggedInUser) {
            // this.authService.openAuthenticationPopover.next(true);
            return;
          }
        });
      }
    });
  }  

  redirectToUserProfile(event) {
    console.log(event);
    this.userService.redirectToUserProfile(event);
  }
}
