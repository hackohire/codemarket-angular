import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {FormBuilderService} from './form-builder.service';
import { Subscription } from 'rxjs';
import { BreadCumb } from './../shared/models/bredcumb.model';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent implements OnInit {
  formDetails: FormGroup;
  public form1 = {components: []};

  displayedColumns: string[];
  dataSource = new MatTableDataSource();
  breadcumb: BreadCumb;

  formJsonListSubscription: Subscription;

  constructor(private formBuilderService: FormBuilderService, @Inject(PLATFORM_ID) private _platformId: Object ) {
  }

  ngOnInit() {
    this.breadcumb = {
      title: 'Form Template List',
    };

    this.formJsonListSubscription = this.formBuilderService.fetchformJson().subscribe((formJsonlist) => {
      this.displayedColumns = ['formName', 'action'];
      this.dataSource.data = formJsonlist;
    });
  }

  onSubmitForm1(event) {
    console.log(event.data);
  }
}
