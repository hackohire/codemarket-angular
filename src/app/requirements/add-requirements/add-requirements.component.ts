import { Component, OnInit } from '@angular/core';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { RequirementStatus } from 'src/app/shared/models/requirement.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { AddRequirement } from 'src/app/core/store/actions/requirement.actions';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

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

  get tagsFormControl() {
    return this.requirementForm.get('tags') as FormArray;
  }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private fb: FormBuilder
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

    this.requirementFormInitialization();
  }

  ngOnInit() {
  }

  requirementFormInitialization() {
    this.requirementForm = new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
      price: new FormControl(''),
      createdBy: new FormControl(),
      shortDescription: new FormControl(),
      categories: new FormControl(null),
      demo_url: new FormControl('', [Validators.pattern(this.urlRegex)]),
      status: new FormControl(RequirementStatus.Created),
      _id: new FormControl(''),
      tags: this.fb.array([]),
    });
  }

  submit() {

    if (this.authService.loggedInUser && !this.createdBy.value) {
      this.createdBy.setValue(this.authService.loggedInUser._id);
    }

    if (this.idFromControl && !this.idFromControl.value) {
      this.requirementForm.removeControl('_id');
    }

    this.store.dispatch(AddRequirement({requirement: this.requirementForm.value}));
  }

  updateFormData(event) {
    console.log(event);
    this.requirementForm.get('description').setValue(event, {emitEvent: false, onlySelf: true});
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const arrayFormControl: FormArray = this.tagsFormControl;
      const a = new FormControl({name: value.trim()});
      arrayFormControl.controls.push(a);
      arrayFormControl.value.push({name: value.trim()});
      this.requirementForm.updateValueAndValidity({emitEvent: true});
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
