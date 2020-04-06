import { Component, OnInit } from '@angular/core';
import { BreadCumb } from './../shared/models/bredcumb.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent implements OnInit {

  constructor() { 
    this.breadcumb = {
      title: `Subscribe News Letter`
    };
  }

  ngOnInit() {
  }

  breadcumb: BreadCumb;
  newsletterForm: FormGroup;
  
  submit(){
  }

}
