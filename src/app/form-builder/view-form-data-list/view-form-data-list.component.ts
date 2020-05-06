import { Component, OnInit, Input } from '@angular/core';
import {FormBuilderService} from '../form-builder.service';
import { Subscription } from 'rxjs';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { MatTableDataSource, MatSort } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-form-data-list',
  templateUrl: './view-form-data-list.component.html',
  styleUrls: ['./view-form-data-list.component.scss']
})
export class ViewFormDataListComponent implements OnInit {

  encryptSecretKey = 'codemarket';
  displayedColumns: string[];
  dataSource = new MatTableDataSource();
  breadcumb: BreadCumb;
  formDataListSubscription: Subscription;
  @Input() formName = '';
  valueList = [];
  keyList = [];

  constructor(private formBuilderService: FormBuilderService, private activatedRoute: ActivatedRoute) {
    this.formName = this.activatedRoute.snapshot.params['formname'];
   }

   ngOnInit() {
    this.breadcumb = {
      title: 'Form Data List',
    };

    this.formDataListSubscription = this.formBuilderService.fetchformData(this.formName).subscribe((formDatalist) => {
      console.log(formDatalist);
      for (let data of formDatalist) {
          this.valueList.push(data.formDataJson);
      }
      this.displayedColumns = Object.keys(this.valueList[0]);
      this.dataSource.data = this.valueList;
    });
  }

}
