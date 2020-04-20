import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { BreadCumb } from '../shared/models/bredcumb.model';
import { EditorComponent } from '../shared/components/editor/editor.component';
import { Subscription } from 'rxjs';
import { Router ,ActivatedRoute} from '@angular/router';
import {QuoteService} from './quote.service';
import Swal from 'sweetalert2';
import { catchError, } from 'rxjs/operators';
import { of } from 'rxjs';
@Component({
  selector: 'app-get-quote',
  templateUrl: './get-quote.component.html',
  styleUrls: ['./get-quote.component.scss']
})
export class GetQuoteComponent implements OnInit {

  breadcumb: BreadCumb;
  postForm: FormGroup;
  preInsuranceType = null;
  preInsuranceTypevalue =null;

  get createdBy() {
    return this.postForm.get('createdBy');
  }

  get idFromControl() {
    return this.postForm.get('_id');
  }

  get descriptionFormControl() {
    return this.postForm.get('description');
  }

  get statusFormControl() {
    return this.postForm.get('status');
  }

  @ViewChild('descriptionEditor', { static: false }) descriptionEditor: EditorComponent;

  subscription$: Subscription;


  constructor(private quoteService: QuoteService,private router:Router, private activatedRoute:ActivatedRoute
    // private authService: AuthService,
    // private store: Store<AppState>,
    // private fb: FormBuilder,
    // private activatedRoute: ActivatedRoute,
    // private formService: FormService
   
  ) {
    this.preInsuranceType = this.router.getCurrentNavigation().extras.state
    if(this.preInsuranceType){
      this.preInsuranceTypevalue = this.preInsuranceType.name
    }
    /** Make the Changes here while creating new post type */
    this.breadcumb = {
      title: 'Get Quote',
      // path: [

      //   {
      //     name: CompanyPostTypes.TeamGoal
      //   }
      // ]
    };
    this.postFormInitialization();
  }

  ngOnInit() {
  }

  postFormInitialization() {
    this.postForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      description: new FormControl([]),
      email: new FormControl('', Validators.email),
      phone: new FormControl(''),
      InsuranceType: new FormControl(''),
      // change this line
    });
  }


   async submit() {
    this.quoteService.addquote(this.postForm.value).pipe(
      catchError((e) => {
        Swal.fire('Email already exists!', '', 'error');
        return of(false);
      })
    ).subscribe((d: any) => {
      if (d) {
        Swal.fire(`${d.firstName} has been Added Successfully`, '', 'success').then(() => {
          this.quoteService.redirectToDashboard(d._id);
        });
      }
    });
   }

}
