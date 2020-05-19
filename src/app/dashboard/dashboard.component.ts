import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { FormBuilderService } from '../form-builder/form-builder.service';
import { PostService } from '../shared/services/post.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  questionnaire: FormGroup;
  showAuth = false;
  fields = [
    {
      name: 'firstName',
      label: 'Enter your First Name*',
      placeholder: 'Enter your First Name*',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      label: 'Enter your Last Name',
      placeholder: 'Enter your Last Name',
      type: 'text',
      required: false,
    },
    {
      name: 'email',
      label: 'Enter your Email*',
      placeholder: 'Enter your Email*',
      type: 'email',
      required: false,
    },
    {
      name: 'phone',
      label: 'Enter your Phone Number(10 Digits)*',
      placeholder: 'Enter your Phone Number(10 Digits)*',
      type: 'number',
      required: true,
    },
    {
      name: 'businessName',
      label: 'Enter your Business Name*',
      placeholder: 'Enter your Business Name*',
      type: 'text',
      required: true,
    },
    {
      name: 'address',
      label: 'Enter your Address*',
      placeholder: 'Enter your Address*',
      type: 'text',
      required: true,
    },
    {
      name: 'heplRequired',
      label: 'what help do you need with your art establishment?',
      placeholder: 'what help do you need with your art establishment?',
      type: 'textarea',
      required: true,
    }
  ];

  constructor(
    public postService: PostService,
    public authService: AuthService,
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
  }

  convertObjectToArray(d) {
    return Object.keys(d);
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
}
