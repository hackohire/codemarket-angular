import { Component, OnInit,  ElementRef, ViewChild, Inject, PLATFORM_ID ,ViewEncapsulation} from '@angular/core';
import { FormControl, FormGroup,FormBuilder, Validators } from '@angular/forms';
import {FormBuilderService} from '../form-builder.service';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';
import { catchError, } from 'rxjs/operators';
import { of } from 'rxjs';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { BreadCumb } from '../../shared/models/bredcumb.model';

@Component({
  selector: 'app-create-form-template',
  templateUrl: './create-form-template.component.html',
  styleUrls: ['./create-form-template.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateFormTemplateComponent implements OnInit {

  @ViewChild('json', {static: true}) jsonElement?: ElementRef;
  public form: Object = {components: []};
  breadcumb: BreadCumb;

  ngOnInit() {
    this.breadcumb = {
      title: 'Create Template',
    };
  }
  formJSON = null;
  formDetails: FormGroup;
  jsonstring = null;
  formjson = null;
  encryptSecretKey = 'codemarket';

  onChange(event) {
    this.formJSON = JSON.stringify(event.form, null, 4);
    // console.log("encripted : " + this.encryptData(JSON.stringify(event.form, null, 4)))
    // console.log("Decrypted : " + this.decryptData(this.encryptData(JSON.stringify(event.form, null, 4))))
  }

  formDetailsInitialization(i: any) {
    this.formDetails = new FormGroup({
      formname: new FormControl(i && i.formname ? i.formname : '', Validators.required),
      jsonstring: new FormControl(i && i.jsonstring ? i.jsonstring : '', Validators.required)
    });
  }

  constructor(private formBuilderService: FormBuilderService, @Inject(PLATFORM_ID) private _platformId: Object) {
    this.formDetailsInitialization(null);
   }
   
   encryptData(data) {

    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptSecretKey).toString();
    } catch (e) {
      console.log(e);
    }
  }

  decryptData(data) {

    try {
      const bytes = CryptoJS.AES.decrypt(data, this.encryptSecretKey);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      console.log(e);
    }
  }


  submit(){
    console.log(this)
    this.formDetails.value.jsonstring = this.encryptData(this.formJSON);
    console.log(this.formDetails.value)
    this.formBuilderService.addformJson(this.formDetails.value).pipe(
      catchError((e) => {
        Swal.fire('Name already exists!', '', 'error');
        return of(false);
      })
    ).subscribe((d: any) => {
      if (d) {
        Swal.fire(`${d.formname} has been Added Successfully`, '', 'success').then(() => {
          this.formBuilderService.redirectToCompanyDetails(d._id);
        });
      }
    });

  }

  isBrowser(){
    return isPlatformBrowser(this._platformId);
  }
}
