import { Component, OnInit,  ElementRef, ViewChild, Inject, PLATFORM_ID ,ViewEncapsulation} from '@angular/core';
import { FormControl, FormGroup,FormBuilder, Validators } from '@angular/forms';
import {FormBuilderService} from '../form-builder.service';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';
import { catchError, } from 'rxjs/operators';
import { of } from 'rxjs';;
import { isPlatformBrowser } from '@angular/common';
import { BreadCumb } from '../../shared/models/bredcumb.model';

@Component({
  selector: 'app-create-form-template',
  templateUrl: './create-form-template.component.html',
  styleUrls: ['./create-form-template.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class CreateFormTemplateComponent implements OnInit {

  @ViewChild('json', {static: true}) jsonElement?: ElementRef;
  public form = {components: []};
  breadcumb: BreadCumb;


  formStructureJSON = null;
  formDetails: FormGroup;
  jsonstring = null;
  formjson = null;
  encryptSecretKey = 'codemarket';

  ngOnInit() {
    this.breadcumb = {
      title: 'Create Template',
    };
  }

  onChange(event) {
    this.formStructureJSON = event.form;
    // console.log("encripted : " + this.encryptData(JSON.stringify(event.form, null, 4)))
    // console.log("Decrypted : " + this.decryptData(this.encryptData(JSON.stringify(event.form, null, 4))))
  }

  formDetailsInitialization() {
    this.formDetails = new FormGroup({
      formname: new FormControl('', Validators.required),
      formStructureJSON: new FormControl(null, Validators.required)
    });
  }

  constructor(private formBuilderService: FormBuilderService, @Inject(PLATFORM_ID) private _platformId: Object) {
    this.formDetailsInitialization();
   }

  submit() {
    this.formDetails.get('formStructureJSON').setValue(this.formStructureJSON);
    console.log(this.formDetails.value);
    this.formBuilderService.addformJson(this.formDetails.value).pipe(
      catchError((e) => {
        console.log(e);
        return of(false);
      })
    ).subscribe((d: any) => {
      if (d) {
        Swal.fire(`${d.formname} has been Added Successfully`, '', 'success').then(() => {
          this.formBuilderService.redirectToFormBuilder();
        });
      }
    });

  }

  isBrowser() {
    return isPlatformBrowser(this._platformId);
  }
}
