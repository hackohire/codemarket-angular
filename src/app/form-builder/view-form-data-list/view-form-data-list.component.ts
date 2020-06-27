import { Component, OnInit, Input, Inject } from '@angular/core';
import {FormBuilderService} from '../form-builder.service';
import { Subscription } from 'rxjs';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { MatTableDataSource, MatSort } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { keyBy } from 'lodash';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'survey-dialog',
  templateUrl: 'survey-user-dialog.html',
})
export class SurveyDialogComponent implements OnInit {
  surveyUserFrom: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SurveyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

  ngOnInit() {
  }

  onOkClick() {
    this.dialogRef.close();
  }

}

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

  individualPoints = [];
  summaryFormAnswers = [];

  sleepQualityFormObj = {
    formName: '',
    individualPoints: []
  };

  sleepQualitySummaryFormObj = {
    formName: '',
    individualPoints: []
  };
  
  constructor(private formBuilderService: FormBuilderService, private activatedRoute: ActivatedRoute, public dialog: MatDialog,) {
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

  onClickCalled(id) {

    this.formBuilderService.fetchSurveyAndSummaryFormDataById(id).subscribe((res) => {

        this.mapValueWithLabel(res);
  
        this.dialog.open(SurveyDialogComponent, {
          data : {
            sleepForm: this.sleepQualityFormObj,
            summaryForm: this.sleepQualitySummaryFormObj,
          }
        });
    });
  };

  mapValueWithLabel(foundEle) {
    this.individualPoints = [];
    this.summaryFormAnswers = [];

    const components = keyBy(foundEle.pFormJson.formStructureJSON.components, 'key');

    this.sleepQualityFormObj.formName = foundEle.formname;
   

    const savedData = foundEle.formDataJson;
    let keySleepForm = Object.keys(savedData);

    keySleepForm.forEach((k) => {
      this.individualPoints.push({
        label: components[k].label,
        value: savedData[k]
      });
    });
      
  
    if (foundEle.cFormJson) { 
      const summaryComponents = keyBy(foundEle.cFormJson.formStructureJSON.components, 'key')
      const summaryFormData = foundEle.connectedFormData.formDataJson;
      let keySummaryFormData = Object.keys(summaryFormData)
  
  
      keySummaryFormData.forEach((k) => {
        this.summaryFormAnswers.push({
          label: summaryComponents[k].label,
          value: summaryFormData[k]
        });
      });

      this.sleepQualitySummaryFormObj.formName = foundEle.cFormJson.formname;
      this.sleepQualitySummaryFormObj.individualPoints = this.summaryFormAnswers;
    }

    this.sleepQualityFormObj.individualPoints = this.individualPoints;

}

}
