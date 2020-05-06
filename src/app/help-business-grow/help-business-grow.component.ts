import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { BreadCumb } from '../shared/models/bredcumb.model';
import { Post } from '../shared/models/post.model';
import { environment } from '../../environments/environment';
import { FormService } from '../shared/services/form.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-help-business-grow',
  templateUrl: './help-business-grow.component.html',
  styleUrls: ['./help-business-grow.component.scss']
})
export class HelpBusinessGrowComponent implements OnInit {
  s3Bucket = environment.s3FilesBucketURL;

  breadcumb: BreadCumb;
  postForm: FormGroup;

  editMode = false;

  /** When a user tries to tie a post with this post */
  postFromRoute: Post;

  businessAreas = [];

  email = '';

  selectedBusinessAreas = [];
  addBusinessAreaString = '';

  get createdBy() {
    return this.postForm.get('createdBy');
  }

  get idFromControl() {
    return this.postForm.get('_id');
  }

  constructor(
    public authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private apollo: Apollo,
    private formService: FormService,
    private router: Router
  ) {

    this.email = this.activatedRoute.snapshot.queryParams.email;

    /** Make the Changes here while creating new post type */
    this.breadcumb = {
      title: `Reserve your spot`,
      // path: [
      //   {
      //     name: this.postType
      //   }
      // ]
    };

    this.postFormInitialization();
  }

  ngOnInit() {
    this.formService.findFromCollection('', 'tags', 'business-area').subscribe((b) => {
      if (b && b.length) {
        this.businessAreas = b;
      }
    });
  }

  postFormInitialization() {
    this.postForm = new FormGroup({
      businessName: new FormControl('', Validators.required),
      email: new FormControl(this.email, Validators.required),
      website: new FormControl(''),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl(''),
      mobileNumber: new FormControl('', Validators.required),
      businessAreas: new FormControl([], Validators.required),
      city: new FormControl('')
    });
  }


  submit() {
    this.apollo.mutate(
      {
        mutation: gql`
            mutation addHelpGrowBusiness($helpGrowBusinessObject: HelpGrowYourBusineessInput) {
              addHelpGrowBusiness(helpGrowBusinessObject: $helpGrowBusinessObject) {
                website
                email
                firstName
                lastName
              }
            }
          `,
        variables: {
          helpGrowBusinessObject: this.postForm.value
        }
      }
    ).pipe(
      map((p: any) => p.data.addHelpGrowBusiness),
      tap((a) => {
        if (a) {
          this.postForm.reset();

          /** If a new user is created with the email id that user has filled, show the message asking to get the password from email inbox and 
           * open the loginpopup
           */
          const staticMessage = 'You have reserved your spot successfully.';
          const message = a.email ? `${staticMessage} Please, Check your email <strong>${a.email}</strong> to get the temporary password.` : staticMessage;
          Swal.fire({titleText: 'Success', html: message, type: 'success'}).then((a) => {
            if (!this.authService.loggedInUser) {
              this.authService.openAuthenticationPopover.next(true);
              return;
            } else {
              this.router.navigate([]);
            }
          });
        }
      })
    ).subscribe();
  }

  addNewBusinessArea() {
    this.formService.addToCollection(this.addBusinessAreaString, 'tags', 'business-area').subscribe((b) => {
      console.log(b);
      if (b) {
        this.businessAreas.push(b);
        this.addBusinessAreaString = '';
        this.editMode = false;
      }
    });
  }

  addSelectedBusinessAreas(ba) {
    const i = this.businessAreas && this.businessAreas.length ?
      this.businessAreas.findIndex(b => b._id === ba._id) : -1;
    if (i > -1) {
      this.businessAreas.splice(i, 1);
      this.selectedBusinessAreas.push(ba);
    }
    this.postForm.get('businessAreas').setValue(this.selectedBusinessAreas);
    console.log(this.selectedBusinessAreas);
    console.log(this.businessAreas);
  }

  removeSelectedBusinessAreas(ba) {
    const i = this.selectedBusinessAreas && this.selectedBusinessAreas.length ?
      this.selectedBusinessAreas.findIndex(b => b._id === ba._id) : -1;
    if (i > -1) {
      this.selectedBusinessAreas.splice(i, 1);
      this.businessAreas.push(ba);
    }
    this.postForm.get('businessAreas').setValue(this.selectedBusinessAreas);
    console.log(this.selectedBusinessAreas);
    console.log(this.businessAreas);
  }

}
