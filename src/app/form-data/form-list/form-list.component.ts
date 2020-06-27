import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilderService } from 'src/app/form-builder/form-builder.service';
import { String } from 'lodash';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { keyBy } from 'lodash';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MySurveyDialogComponent } from 'src/app/survey/my-survey/my-survey.component';


@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss']
})
export class FormListComponent implements OnInit {

  formJsonListSubscription;
  formList;
  totalCount = 0;

  paginator: MatPaginator;
  formStrucureId;

  savedFormData = [];
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

  constructor(
    private formBuilderService: FormBuilderService,
    private authService: AuthService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.formJsonListSubscription = this.formBuilderService.fetchformJson().subscribe((formJsonlist) => {
      if (this.authService.loggedInUser.roles.indexOf("Admin") >= 0) {
        this.formList = formJsonlist;
      } else {
        this.formList = [];
      }
    });
  }

  formButtonClick(formStrucureId: string) {
    this.formStrucureId = formStrucureId;

    const paginationObj = {
      pageNumber: 1, limit: 10,
      sort: { order: '' }
    };

    this.formBuilderService.fetchSavedDataByFormStructure(paginationObj, formStrucureId).subscribe((res) => {
      this.savedFormData = res.data;
      this.totalCount = res.total;

      this.savedFormData.forEach((data) => {
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

  fetchFormData() {
    const paginationObj = {
      pageNumber: this.paginator.pageIndex + 1, limit: this.paginator.pageSize ? this.paginator.pageSize : 10,
      sort: { order: '' }
    };

    this.formBuilderService.fetchSavedDataByFormStructure(paginationObj, this.formStrucureId).subscribe((res) => {
      this.savedFormData = res.data;
      this.savedFormData.forEach((data) => {
        data['totalPoints'] = this.calculateTotalPoints(data.formDataJson);
      })
    });

  }

  onClickCalled(id) {

    this.formBuilderService.fetchSurveyAndSummaryFormDataById(id).subscribe((res) => {

        this.mapValueWithLabel(res);
  
        this.dialog.open(MySurveyDialogComponent, {
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
