import { Component, OnInit } from '@angular/core';
import { QuoteService } from './quote.service';

@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.scss']
})

export class ClassroomComponent implements OnInit {

  // Jane add
  formFieldObject: any;
  // Jane add end

  constructor(
    private quoteService: QuoteService
  ) { }

  ngOnInit() {
  }

  // Jane add for Insurance Quote
  getQuote(name, email, zipCode, age, sex, coverageAmount, termLength, healthLevel) {
    const formFieldObject = {
    name: name,
    email: email,
    zipCode: zipCode,
    age: age,
    sex: sex,
    coverageAmount: coverageAmount,
    termLength: termLength,
    healthLevel: healthLevel
    };

    this.quoteService.getQuote(formFieldObject).subscribe((quote) => {
      if (quote) {
        this.formFieldObject = quote;
      }
    })
  }
  // Jane add end

}
