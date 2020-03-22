import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { BreadCumb } from '../shared/models/bredcumb.model';
import { EditorComponent } from '../shared/components/editor/editor.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-get-quote',
  templateUrl: './get-quote.component.html',
  styleUrls: ['./get-quote.component.scss']
})
export class GetQuoteComponent implements OnInit {

  breadcumb: BreadCumb;
  postForm: FormGroup;

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


  constructor(
    // private authService: AuthService,
    // private store: Store<AppState>,
    // private fb: FormBuilder,
    // private activatedRoute: ActivatedRoute,
    // private formService: FormService
  ) {

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
      name: new FormControl('', Validators.required),
      description: new FormControl([]),
      email: new FormControl('', Validators.email),
      phone: new FormControl(''),
      insuranceType: new FormControl(''),
      // change this line
    });
  }


  // async submit(status) {

  //   if (!this.authService.loggedInUser) {
  //     this.authService.checkIfUserIsLoggedIn(true);
  //     return;
  //   }

  //   this.statusFormControl.setValue(status);

  //   const blocks =  await this.descriptionEditor.editor.save();
  //   this.descriptionFormControl.setValue(blocks.blocks);

  //   if (this.authService.loggedInUser && !this.createdBy.value) {
  //     this.createdBy.setValue(this.authService.loggedInUser._id);
  //   }

  //   if (this.idFromControl && !this.idFromControl.value) {
  //     this.postForm.removeControl('_id');
  //     this.store.dispatch(AddPost({post: this.postForm.value}));
  //   } else {
  //     this.store.dispatch(UpdatePost({post: this.postForm.value}));
  //   }
  // }

}
