import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormBuilderService } from 'src/app/form-builder/form-builder.service';
import { keyBy } from 'lodash';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';


@Component({
  selector: 'survey-dialog',
  templateUrl: 'my-survey-dialog.html',
})
export class MySurveyDialogComponent implements OnInit {
  surveyUserFrom: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<MySurveyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

  ngOnInit() {
    this.surveyUserFrom = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  onOkClick() {
    this.dialogRef.close();
  }

}


@Component({
  selector: 'app-my-survey',
  templateUrl: './my-survey.component.html',
  styleUrls: ['./my-survey.component.scss']
})
export class MySurveyComponent implements OnInit {

  mysurveyList = [];
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

  totalCount;
  paginator: MatPaginator;

  constructor(
    private authService: AuthService,
    private formBuilderService: FormBuilderService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    if (!this.authService.loggedInUser._id) {
      this.authService.checkIfUserIsLoggedIn(true);
      this.router.navigate(['/dashboard']);
      return;
    }

    const paginationObj = {
      pageNumber: 1, limit: 10,
      sort: {order: ''}};
      
    this.authService.loggedInUser$.subscribe((u) => {
      if (u) {
        this.formBuilderService.getMySurveyData(paginationObj, this.authService.loggedInUser._id).subscribe((res) => {
          this.mysurveyList = res.data;
          this.totalCount = res.total;
          this.mysurveyList.forEach((data) => {
            data['totalPoints'] = this.calculateTotalPoints(data.formDataJson);
          })
        });
      }
    })
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

  displayIndividualPoints(id) {
    this.individualPoints = [];
    this.summaryFormAnswers = [];
    const foundEle = this.mysurveyList.find((ele) => {
      return ele._id === id
    });

    this.mapValueWithLabel(foundEle);
    console.log(foundEle);

    this.dialog.open(MySurveyDialogComponent, {
      data : {
        sleepForm: this.sleepQualityFormObj,
        summaryForm: this.sleepQualitySummaryFormObj,
      }
    });
  }

  mapValueWithLabel(foundEle) {
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

  fetchSurveyFormData() {
    const paginationObj = {
      pageNumber: this.paginator.pageIndex + 1, limit: this.paginator.pageSize ? this.paginator.pageSize : 10,
      sort: { order: '' }
    };

    this.authService.loggedInUser$.subscribe((u) => {
      if (u) {
        this.formBuilderService.getMySurveyData(paginationObj, this.authService.loggedInUser._id).subscribe((res) => {
          this.mysurveyList = res.data;
          this.totalCount = res.total;
          this.mysurveyList.forEach((data) => {
            data['totalPoints'] = this.calculateTotalPoints(data.formDataJson);
          })
        });
      }
    });

  }

}
