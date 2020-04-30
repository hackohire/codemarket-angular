import { Component, OnInit, Inject, ElementRef, ViewChild, PLATFORM_ID } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { FormControl, FormGroup,FormBuilder, Validators } from '@angular/forms';
import {FormBuilderService} from './form-builder.service';
import { Subscription } from 'rxjs';
import { BreadCumb } from './../shared/models/bredcumb.model';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent implements OnInit {

  encryptSecretKey = 'codemarket';
  formJSON = null;
  formDetails: FormGroup;
  jsonstring = null;
  formjson = null;
  public form1: Object = {components: []};
  testFormStructure = null;
  testFormStructureCompo = null;

  displayedColumns: string[];
  dataSource = new MatTableDataSource();
  breadcumb: BreadCumb

  formJsonListSubscription: Subscription;
  
  constructor(private formBuilderService: FormBuilderService, @Inject(PLATFORM_ID) private _platformId: Object ) {
  }

  ngOnInit() {
    this.breadcumb = {
      title: 'Form Template List',
    };

    this.formJsonListSubscription = this.formBuilderService.fetchformJson().subscribe((formJsonlist) => {
      this.displayedColumns = ['formName','action'];
      this.dataSource.data = formJsonlist;
    });
  }

  onSubmitForm1(event) {
    console.log(event.data);
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
