import { Component, OnInit } from '@angular/core';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductStatus } from 'src/app/shared/models/product.model';

@Component({
  selector: 'app-askforhelp',
  templateUrl: './askforhelp.component.html',
  styleUrls: ['./askforhelp.component.scss']
})
export class AskforhelpComponent implements OnInit {

  breadcumb: BreadCumb;
  askForHelpForm: FormGroup;
  modules = {
    formula: true,
    // imageResize: {},
    syntax: true,
  };

  constructor() {
    this.breadcumb = {
      title: 'Ask For Help By Filling out the given form',
      path: [
        {
          name: 'Dashboard'
        },
        {
          name: 'Help'
        }
      ]
    };

    this.askForHelpFormInitialization();
  }

  ngOnInit() {
  }

  askForHelpFormInitialization(): void {
    this.askForHelpForm = new FormGroup({
      question: new FormControl(''),
      description: new FormControl(''),
      price: new FormControl('')
    });
  }

  submit() {
    console.log(this.askForHelpForm.value)
  }

}
