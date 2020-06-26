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
  formId;
  totalCount;

  constructor(private formBuilderService: FormBuilderService, private activatedRoute: ActivatedRoute) {
    this.formId = this.activatedRoute.snapshot.params['formId'];
   }

   ngOnInit() {
    this.breadcumb = {
      title: 'Form Data List',
    };

    const paginationObj = {
      pageNumber: 1, limit: 10,
      sort: { order: '' }
    };

    this.formDataListSubscription = this.formBuilderService.fetchformData(paginationObj, this.formId).subscribe((res) => {
      console.log(res);

      this.valueList = res.data;
      this.totalCount = res.total;

      this.valueList.forEach((data) => {
        data['totalPoints'] = this.calculateTotalPoints(data.formDataJson);
      })

    });
  }

  calculateTotalPoints(data) {
    let totalPoint = 0;
    const values = Object.values(data);
      values.forEach((v: any) => {
        if (parseInt(v)) {
          totalPoint += v;
        }
      });
    
    return totalPoint;
  }

}
