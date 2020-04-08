import { Component, OnInit } from '@angular/core';
import { BreadCumb } from './../shared/models/bredcumb.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss']
})
export class DonateComponent implements OnInit {

  constructor() { 
    this.breadcumb = {
      title: `Donate to help LA Small Businesses`
    };
  }

  ngOnInit() {
  }

  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  breadcumb: BreadCumb;
  donteForm: FormGroup;

  submit(){
  }
}
