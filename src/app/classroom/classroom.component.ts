import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.scss']
})

export class ClassroomComponent implements OnInit {

  // Jane add
  formFieldObject: any;
  // Jane add end

  constructor() { }

  ngOnInit() {
  }

  // Jane add for Insurance Quote
  getQuote(name, email, zipCode, age, sex, coverageAmount, termLength, healthLevel) {
    this.formFieldObject = {
    name: name,
    email: email,
    zipCode: zipCode,
    age: age,
    sex: sex,
    coverageAmount: coverageAmount,
    termLength: termLength,
    healthLevel: healthLevel
    };
  }
  // Jane add end

}
