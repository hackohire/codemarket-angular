import { Component, OnInit } from '@angular/core';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InterviewStatus } from 'src/app/shared/models/interview.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { AddInterview } from 'src/app/core/store/actions/interview.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';

@Component({
  selector: 'app-add-interview',
  templateUrl: './add-interview.component.html',
  styleUrls: ['./add-interview.component.scss']
})
export class AddInterviewComponent implements OnInit {

  urlRegex = '^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$';
  breadcumb: BreadCumb;
  interviewForm: FormGroup;
  modules = {
    formula: true,
    syntax: true,
  };

  get createdBy() {
    return this.interviewForm.get('createdBy');
  }

  get idFromControl() {
    return this.interviewForm.get('_id');
  }

  constructor(
    private authService: AuthService,
    private store: Store<AppState>
  ) {
    this.breadcumb = {
      title: 'Add Interview Details',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'Add Interview'
        }
      ]
    };

    this.interviewFormInitialization();
  }

  ngOnInit() {
  }

  interviewFormInitialization() {
    this.interviewForm = new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
      price: new FormControl(''),
      createdBy: new FormControl(),
      shortDescription: new FormControl(),
      categories: new FormControl(null),
      demo_url: new FormControl('', [Validators.pattern(this.urlRegex)]),
      status: new FormControl(InterviewStatus.Created),
      _id: new FormControl(''),
    });
  }

  submit() {

    if (this.authService.loggedInUser && !this.createdBy.value) {
      this.createdBy.setValue(this.authService.loggedInUser._id);
    }

    if (this.idFromControl && !this.idFromControl.value) {
      this.interviewForm.removeControl('_id');
    }

    this.store.dispatch(new AddInterview(this.interviewForm.value));
  }

  updateFormData(event) {
    console.log(event);
    this.interviewForm.get('description').setValue(event, {emitEvent: false, onlySelf: true});
  }
}
