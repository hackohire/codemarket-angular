import { Component, OnInit ,Input} from '@angular/core';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import * as CryptoJS from 'crypto-js'
import {FormBuilderService} from '../form-builder.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-form-data',
  templateUrl: './add-form-data.component.html',
  styleUrls: ['./add-form-data.component.scss']
})
export class AddFormDataComponent implements OnInit {

  @Input() formName = '';

  constructor(private formBuilderService: FormBuilderService,
    private activatedRoute: ActivatedRoute) {
    this.formName = this.activatedRoute.snapshot.queryParams['formname'];
  }
  formJsonListSubscription: Subscription;
  breadcumb: BreadCumb
  testFormStructure = null;
  testFormStructureCompo = null;
  encryptSecretKey = 'codemarket';
  public form1: Object = {components: []};
  currentForm = null;



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
  }
}
