import { Component, OnInit } from '@angular/core';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { RequirementStatus, Requirement } from 'src/app/shared/models/requirement.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { AddRequirement, SetSelectedRequirement, GetRequirementById, UpdateRequirement } from 'src/app/core/store/actions/requirement.actions';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { selectSelectedRequirement } from 'src/app/core/store/selectors/requirement.selectors';

@Component({
  selector: 'app-add-requirements',
  templateUrl: './add-requirements.component.html',
  styleUrls: ['./add-requirements.component.scss']
})
export class AddRequirementsComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  urlRegex = '^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$';
  breadcumb: BreadCumb;
  requirementForm: FormGroup;
  modules = {
    formula: true,
    syntax: true,
  };

  get createdBy() {
    return this.requirementForm.get('createdBy');
  }

  get idFromControl() {
    return this.requirementForm.get('_id');
  }

  get descriptionFormControl() {
    return this.requirementForm.get('description');
  }

  get tagsFormControl() {
    return this.requirementForm.get('tags') as FormArray;
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
      title: 'Add Requirement Details',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'Add Requirements'
        }
      ]
    };

    /** If it is "add-requirement" route intialize empty requirement form, but we are setting store property of "Selectedrequirement" as null
     * and if it is "edit-requirement route" we need to subscribe to get "Selectedrequirement" and user refresh the tab,
     * there won't be any selected requirement,
     * so we need to make the call to
     * get the requirement by fetching id from the params
     */

    if (this.activatedRoute.snapshot.parent.routeConfig.path === 'add-interview') {
      this.store.dispatch(SetSelectedRequirement({ requirement: null }));
      this.requirementFormInitialization(null);
    } else {
      this.subscription$ = this.store.select(selectSelectedRequirement).pipe(
        tap((h: Requirement) => {
          this.requirementFormInitialization(h);
        }),
        switchMap((h: Requirement) => {
          if (!h) {
            return this.activatedRoute.params;
          }
          return of({ requirementId: '' });
        }),
        tap((params) => {
          /** When user refresh the tab, there won't be any selected requirement, so we need to make the call to
           * get the requirement by fetching id from the params
           */
          if (params.requirementId) {
            this.store.dispatch(GetRequirementById({ requirementId: params.requirementId }));
          }
        })
      ).subscribe();
    }

    // this.requirementFormInitialization();
  }

  ngOnInit() {
  }

  requirementFormInitialization(r: Requirement) {
    this.requirementForm = new FormGroup({
      name: new FormControl(r && r.name ? r.name : ''),
      description: new FormControl(r && r.description ? r.description : ''),
      price: new FormControl(r && r.price ? r.price : ''),
      createdBy: new FormControl(r && r.createdBy && r.createdBy._id ? r.createdBy._id : ''),
      shortDescription: new FormControl(r && r.shortDescription ? r.shortDescription : ''),
      categories: new FormControl(r && r.categories ? r.categories : []),
      demo_url: new FormControl(r && r.demo_url ? r.demo_url : '', [Validators.pattern(this.urlRegex)]),
      // documentation_url: new FormControl('', [Validators.pattern(this.urlRegex)]),
      // video_url: new FormControl('', [Validators.pattern(this.urlRegex)]),
      status: new FormControl(RequirementStatus.Created),
      _id: new FormControl(r && r._id ? r._id : ''),
      tags: this.fb.array(r && r.tags && r.tags.length ? r.tags : []),
      // snippets: new FormControl(null),
    });
  }

  submit() {

    if (this.authService.loggedInUser && !this.createdBy.value) {
      this.createdBy.setValue(this.authService.loggedInUser._id);
    }

    if (this.idFromControl && !this.idFromControl.value) {
      this.requirementForm.removeControl('_id');
      this.store.dispatch(AddRequirement({ requirement: this.requirementForm.value }));
    } else {
      this.store.dispatch(UpdateRequirement({requirement: this.requirementForm.value}));
    }
  }

  updateFormData(event) {
    console.log(event);
    this.requirementForm.get('description').setValue(event);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const arrayFormControl: FormArray = this.tagsFormControl;
      const a = new FormControl({ name: value.trim() });
      arrayFormControl.controls.push(a);
      arrayFormControl.value.push({ name: value.trim() });
      this.requirementForm.updateValueAndValidity({ emitEvent: true });
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
    this.requirementForm.updateValueAndValidity();
  }

}
