import { Component, OnInit } from '@angular/core';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductStatus } from 'src/app/shared/models/product.model';
import { RequirementStatus } from 'src/app/shared/models/requirement.model';

@Component({
  selector: 'app-add-requirements',
  templateUrl: './add-requirements.component.html',
  styleUrls: ['./add-requirements.component.scss']
})
export class AddRequirementsComponent implements OnInit {

  urlRegex = '^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$';
  breadcumb: BreadCumb;
  requirementForm: FormGroup;
  modules = {
    formula: true,
    syntax: true,
  };

  constructor() {
    this.breadcumb = {
      title: 'Add Requirement Details',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'Add Requirements'
        }
      ]
    };

    this.requirementFormInitialization();
  }

  ngOnInit() {
  }

  requirementFormInitialization() {
    this.requirementForm = new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
      price: new FormControl(''),
      createdBy: new FormControl(),
      shortDescription: new FormControl(),
      categories: new FormControl(null),
      demo_url: new FormControl('', [Validators.pattern(this.urlRegex)]),
      documentation_url: new FormControl('', [Validators.pattern(this.urlRegex)]),
      video_url: new FormControl('', [Validators.pattern(this.urlRegex)]),
      status: new FormControl(RequirementStatus.Created),
      _id: new FormControl(''),
      snippets: new FormControl(null),
    });
  }

  submit() {}

}
