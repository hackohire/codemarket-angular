import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import {FormBuilderService} from '../../form-builder/form-builder.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatSort } from '@angular/material';
import { BreadCumb } from '../../shared/models/bredcumb.model';

@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.scss']
})
export class LeadComponent implements OnInit {

  companyId = '';
  breadcumb: BreadCumb;
  formDataListSubscription: Subscription;
  valueList = [];
  displayedColumns: string[];
  dataSource = new MatTableDataSource();
  
  fetchformDataById
  constructor(
    private formBuilderService: FormBuilderService,
    private activatedRoute: ActivatedRoute,
    @Inject(PLATFORM_ID) private _platformId
  ) {
    this.companyId =  this.companyId;
   }

  ngOnInit() {
    this.breadcumb = {
      title: 'Form Data List',
    };

    this.formDataListSubscription = this.formBuilderService.fetchformDataById(this.companyId,'5eb409c53a429f353b3d8b0b').subscribe((formDatalist) => {
      console.log(formDatalist);
      for (let data of formDatalist) {
          this.valueList.push(data.formDataJson);
      }
      this.displayedColumns = Object.keys(this.valueList[0]);
      this.dataSource.data = this.valueList;
    });
  }



}
