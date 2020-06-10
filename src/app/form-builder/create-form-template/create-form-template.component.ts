import { Component, OnInit, ElementRef, ViewChild, Inject, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormBuilderService } from '../form-builder.service';
import Swal from 'sweetalert2';
import { catchError, } from 'rxjs/operators';
import { of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-form-template',
  templateUrl: './create-form-template.component.html',
  styleUrls: ['./create-form-template.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class CreateFormTemplateComponent implements OnInit {

  formId = '';

  @ViewChild('json', { static: true }) jsonElement?: ElementRef;
  public form = { components: [] };
  breadcumb: BreadCumb;


  formStructureJSON = null;
  formDetails: FormGroup;

  constructor(
    private formBuilderService: FormBuilderService,
    @Inject(PLATFORM_ID) private _platformId,
    private activatedRoute: ActivatedRoute
  ) {
    this.formId = this.activatedRoute.snapshot.params['formId'];

    if (this.formId) {
      this.formBuilderService.fetchFormStructureById(this.formId).subscribe(f => {
        if (f) {
          this.form = f.formStructureJSON;
          this.formDetailsInitialization(f);
        }
      });
    } else {
      this.formDetailsInitialization(null);
    }
  }

  ngOnInit() {
    this.breadcumb = {
      title: 'Create Template',
    };
  }


  onChange(event) {
    this.formStructureJSON = event.form;
  }

  formDetailsInitialization(form) {

    this.formDetails = new FormGroup({
      formname: new FormControl(form && form.formname ? form.formname : '', Validators.required),
      formStructureJSON: new FormControl(form && form.formStructureJSON ? form.formStructureJSON : null, Validators.required)
    });
    if (this.formId) {
      this.formDetails.addControl('_id', new FormControl(this.formId));
    }
  }

  submit() {
    if (this.formStructureJSON) {
      this.formDetails.get('formStructureJSON').setValue(this.formStructureJSON);
    }
    console.log(this.formDetails.value);
    this.formBuilderService.addformJson(this.formDetails.value).pipe(
      catchError((e) => {
        console.log(e);
        return of(false);
      })
    ).subscribe((d: any) => {
      if (d) {
        const message = this.formId ? `${d.formname} has been Updated Successfully` : `${d.formname} has been Added Successfully`;
        Swal.fire(message, '', 'success').then(() => {
          this.formBuilderService.redirectToFormBuilder();
        });
      }
    });

  }

  isBrowser() {
    return isPlatformBrowser(this._platformId);
  }
}
