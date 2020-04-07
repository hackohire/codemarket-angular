import { Component, OnInit } from '@angular/core';
import { BreadCumb } from './../shared/models/bredcumb.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrls: ['./volunteer.component.scss']
})
export class VolunteerComponent implements OnInit {

  constructor() { 
    this.breadcumb = {
      title: `Volunteer`
    };
  }

  ngOnInit() {
  }


  breadcumb: BreadCumb;
  volunteerForm: FormGroup;
  
  submit(){
  }

}
