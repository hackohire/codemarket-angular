import { Component, OnInit } from '@angular/core';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { InterviewStatus, Interview } from 'src/app/shared/models/interview.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { AddInterview, UpdateInterview, SetSelectedInterview, GetInterviewById } from 'src/app/core/store/actions/interview.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Subscription, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { selectSelectedInterview } from 'src/app/core/store/selectors/interview.selectors';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-add-interview',
  templateUrl: './add-interview.component.html',
  styleUrls: ['./add-interview.component.scss']
})
export class AddInterviewComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
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

  get descriptionFormControl() {
    return this.interviewForm.get('description');
  }

  get supportDescriptionFormControl() {
    return this.interviewForm.get('support').get('description');
  }

  get tagsFormControl() {
    return this.interviewForm.get('tags') as FormArray;
  }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  subscription$: Subscription;
  
  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
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

    /** If it is "add-interview" route intialize empty interview form, but we are setting store property of "Selectedinterview" as null
     * and if it is "edit-interview route" we need to subscribe to get "Selectedinterview" and user refresh the tab,
     * there won't be any selected interview,
     * so we need to make the call to
     * get the interview by fetching id from the params
     */

    if (this.activatedRoute.snapshot.parent.routeConfig.path === 'add-interview') {
      this.store.dispatch(SetSelectedInterview({ interview: null }));
      this.interviewFormInitialization(null);
    } else {
      this.subscription$ = this.store.select(selectSelectedInterview).pipe(
        tap((h: Interview) => {
          this.interviewFormInitialization(h);
        }),
        switchMap((h: Interview) => {
          if (!h) {
            return this.activatedRoute.params;
          }
          return of({ interviewId: '' });
        }),
        tap((params) => {
          /** When user refresh the tab, there won't be any selected interview, so we need to make the call to
           * get the interview by fetching id from the params
           */
          if (params.interviewId) {
            this.store.dispatch(GetInterviewById({ interviewId: params.interviewId }));
          }
        })
      ).subscribe();
    }

    // this.interviewFormInitialization();
  }

  ngOnInit() {
  }

  interviewFormInitialization(i: Interview) {
    this.interviewForm = new FormGroup({
      name: new FormControl(i && i.name ? i.name : ''),
      description: new FormControl(i && i.description ? i.description : ''),
      price: new FormControl(i && i.price ? i.price : ''),
      createdBy: new FormControl(i && i.createdBy && i.createdBy._id ? i.createdBy._id : ''),
      shortDescription: new FormControl(i && i.shortDescription ? i.shortDescription : ''),
      categories: new FormControl(i && i.categories ? i.categories : []),
      demo_url: new FormControl(i && i.demo_url ? i.demo_url : '', [Validators.pattern(this.urlRegex)]),
      // documentation_url: new FormControl('', [Validators.pattern(this.urlRegex)]),
      // video_url: new FormControl('', [Validators.pattern(this.urlRegex)]),
      status: new FormControl(InterviewStatus.Created),
      _id: new FormControl(i && i._id ? i._id : ''),
      tags: this.fb.array(i && i.tags && i.tags.length ? i.tags : []),
      support: new FormGroup({
        time: new FormControl(i && i.support && i.support.time ? i.support.time : ''),
        description: new FormControl(i && i.support && i.support.description ? i.support.description : '')
      })
      // snippets: new FormControl(null),
    });
  }

  submit() {

    if (this.authService.loggedInUser && !this.createdBy.value) {
      this.createdBy.setValue(this.authService.loggedInUser._id);
    }

    if (this.idFromControl && !this.idFromControl.value) {
      this.interviewForm.removeControl('_id');
      this.store.dispatch(AddInterview({interview: this.interviewForm.value}));
    } else {
      this.store.dispatch(UpdateInterview({interview: this.interviewForm.value}));
    }
  }

  updateFormData(event) {
    console.log(event);
    this.interviewForm.get('description').setValue(event);
  }

  addTech(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const arrayFormControl: FormArray = this.tagsFormControl;
      const a = new FormControl({name: value.trim()});
      arrayFormControl.controls.push(a);
      arrayFormControl.value.push({name: value.trim()});
      this.interviewForm.updateValueAndValidity({emitEvent: true});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }


  // Remove a Tag
  public remove(index: number): void {
    const arrayFormControl: FormArray = this.tagsFormControl;
    arrayFormControl.value.splice(index, 1);
    this.interviewForm.updateValueAndValidity();
  }
}
