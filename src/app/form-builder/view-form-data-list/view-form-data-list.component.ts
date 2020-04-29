import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { FormControl, FormGroup,FormBuilder, Validators } from '@angular/forms';
import {FormBuilderService} from '../form-builder.service';
import Swal from 'sweetalert2';
import { catchError, } from 'rxjs/operators';
import { of } from 'rxjs';
import { Subscription } from 'rxjs';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { MatTableDataSource, MatSort } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-form-data-list',
  templateUrl: './view-form-data-list.component.html',
  styleUrls: ['./view-form-data-list.component.scss']
})
export class ViewFormDataListComponent implements OnInit {

  encryptSecretKey = 'codemarket';
  displayedColumns: string[];
  dataSource = new MatTableDataSource();
  breadcumb: BreadCumb
  formDataListSubscription: Subscription;
  @Input() formName = '';
  valueList = [];
  keyList = [];
  
  constructor(private formBuilderService: FormBuilderService, private activatedRoute: ActivatedRoute) {
    this.formName = this.activatedRoute.snapshot.params['formname'];
   }

   ngOnInit() {
    this.breadcumb = {
      title: 'Form Data List',
    };

    this.formDataListSubscription = this.formBuilderService.fetchformData(this.formName).subscribe((formDatalist) => {
      console.log(formDatalist);
      this.valueList
      for (let data of formDatalist) {
          console.log(this.decryptData(data.jsonstring));
          this.valueList.push(this.decryptData(data.jsonstring))
      }
      this.displayedColumns = Object.keys(this.valueList[0])
      this.dataSource.data = this.valueList;
    });
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
