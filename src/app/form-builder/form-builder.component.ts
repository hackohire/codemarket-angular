import { Component, OnInit,  ElementRef, ViewChild } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent implements OnInit {

  @ViewChild('json', {static: true}) jsonElement?: ElementRef;
  public form: Object = {components: []};

  

  onChange(event) {
    this.formJSON = JSON.stringify(event.form, null, 4);
    // console.log("encripted : " + this.encryptData(JSON.stringify(event.form, null, 4)))
    // console.log("Decrypted : " + this.decryptData(this.encryptData(JSON.stringify(event.form, null, 4))))
  }

  encryptSecretKey = 'codemarket';
  formJSON = null;

  constructor() { }

  ngOnInit() {
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
    console.log(this.formJSON)
    console.log(this.encryptData(this.formJSON));
  }

}
