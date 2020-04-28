import { Component, OnInit ,Input} from '@angular/core';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import * as CryptoJS from 'crypto-js'
import {FormBuilderService} from '../form-builder.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup,FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { catchError, } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-add-form-data',
  templateUrl: './add-form-data.component.html',
  styleUrls: ['./add-form-data.component.scss']
})
export class AddFormDataComponent implements OnInit {

  @Input() formName = '';

  constructor(private formBuilderService: FormBuilderService,
    private activatedRoute: ActivatedRoute) {
    this.formName = this.activatedRoute.snapshot.params['formname'];
    this.formDetailsInitialization(null);
  }
  formJsonListSubscription: Subscription;
  breadcumb: BreadCumb
  testFormStructure = null;
  testFormStructureCompo = null;
  encryptSecretKey = 'codemarket';
  public form1: Object = {components: []};
  currentForm = null;
  formDetails: FormGroup;


  ngOnInit() {
    this.breadcumb = {
      title: 'Add Form Data',
    };

    this.formJsonListSubscription = this.formBuilderService.fetchformJson().subscribe((formJsonlist) => {
      for (let form of formJsonlist) {
        if (form.formname == this.formName){
          this.currentForm = form;
        }
      }
      try {
        const bytes = CryptoJS.AES.decrypt(this.currentForm.jsonstring, this.encryptSecretKey);
        if (bytes.toString()) {
          this.testFormStructure = JSON.parse(bytes.toString(CryptoJS.enc.Utf8)); 
        }
        else{
          this.testFormStructure = this.currentForm.jsonstring
        }
      } catch (e) {
        console.log(e);
      }
      console.log(this.testFormStructure)
      this.form1 = JSON.parse(this.testFormStructure);
    });
  }

  onSubmitForm1(event) {
    console.log(event.data);
    this.formDetails.value.formname = this.formName;
    this.formDetails.value.jsonstring = this.encryptData(event.data);

    this.formBuilderService.addformData(this.formDetails.value).pipe(
      catchError((e) => {
        Swal.fire('Name already exists!', '', 'error');
        return of(false);
      })
    ).subscribe((d: any) => {
      if (d) {
        Swal.fire(`${d.formname} has been Added Successfully`, '', 'success').then(() => {
          this.formBuilderService.redirectToBack(d._id);
        });
      }
    });
  }

  formDetailsInitialization(i: any) {
    this.formDetails = new FormGroup({
      formname: new FormControl(i && i.formname ? i.formname : '', Validators.required),
      jsonstring: new FormControl(i && i.jsonstring ? i.jsonstring : '', Validators.required)
    });
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

}
