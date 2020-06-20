import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilderService } from '../form-builder/form-builder.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../core/services/auth.service';
import { keyBy, sumBy } from 'lodash';
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
    this.surveyUserFrom = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  onSubmitClick() {
    this.dialogRef.close(this.surveyUserFrom.value);
  }
}


@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {

  formName = '';
  connectedFormStructureId = '';
  surveySummaryFormId = '';
  connectedFormDataId = '';
  formJsonListSubscription: Subscription;
  formDetails: FormGroup;
  public form1 = { components: [], image: '' };
  totalPoints = 0;
  id;

  formDataJsonToSave = [];
  currentFormIndex = 0;
  lastFormIndex = -1;

  fillForm = true;
  individualPoints =[];
  formArray = [];
  enableSubmitButton = false;

  hideAllButton = false;
  surveySummaryTitle = '';

  summaryForm = false;

  constructor(
    private formBuilderService: FormBuilderService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
    ) { 
      this.connectedFormStructureId = '5ee1fad4be0ca353ff5caa45';
      this.surveySummaryFormId = '5eec9b37aeb42c52592fd4de';
    }
    images = [
      '../../assets/images/sleep-icons/black-icons/01.svg',     
      '../../assets/images/sleep-icons/black-icons/02.svg',
      '../../assets/images/sleep-icons/black-icons/03.svg',
      '../../assets/images/sleep-icons/black-icons/04.svg',
      '../../assets/images/sleep-icons/black-icons/05.svg',
      '../../assets/images/sleep-icons/black-icons/06.svg',
      '../../assets/images/sleep-icons/black-icons/07.svg',
      '../../assets/images/sleep-icons/black-icons/08.svg'
    ];

  ngOnInit() {

    this.id = this.activatedRoute.snapshot.queryParams.id || '';
    if(this.id !== '') {
      console.log("Id ==> ", this.id);
      this.summaryForm = true;

      this.formBuilderService.fetchformDataById(this.id).subscribe((res) => {
        // this.hideAllButton = true;
        const values = Object.values(res[0].formDataJson);
        values.forEach((v: any) => {
          if (parseInt(v)) {
            this.totalPoints += v;
          }
        });
        this.createSurveySummaryTitle(this.totalPoints);
        this.getSummaryFormData(this.id);
        // this.mapValueWithLabel(res[0]);
      });
    } else {
      this.formJsonListSubscription = this.formBuilderService.fetchFormStructureById(this.connectedFormStructureId).subscribe((formJson) => {
        if (formJson) {
          this.formName = formJson.formname;
          formJson.formStructureJSON.components.forEach((c, i) =>{
            if (i < formJson.formStructureJSON.components.length-1) {
              this.formArray.push({
                form1: {
                  components: [c],
                  value: this.totalPoints,
                  image: this.images[i]
                }
              });
    
              this.formDataJsonToSave.push({
                [c.key]: 0,
                selected: false
              })
            }
          });
  
          this.form1 = this.formArray[this.currentFormIndex].form1;
        }
        this.formDetailsInitialization(null);
      });
    }
  }

  formDetailsInitialization(i: any) {
    this.formDetails = new FormGroup({
      formname: new FormControl(i && i.formname ? i.formname : this.formName, Validators.required),
      formDataJson: new FormControl(i && i.jsonstring ? i.jsonstring : '', Validators.required),
      connectedFormStructureId: new FormControl(i && i._id ? i._id : this.connectedFormStructureId),
      createdBy: new FormControl(this.authService.loggedInUser ? this.authService.loggedInUser._id: ''),
      formDataId: new FormControl('')
    });
  }

  valueChangeFun(event) {
    if (event.data && Object.keys(event.data).length > 0) {
      const values : any= Object.values(event.data);
      // this.totalPoints = 0;
      // values.forEach((i: any) => {
      //   if (parseInt(i)) {
      //     this.totalPoints += i;
      //   }
      // });

      if (!this.summaryForm) {
        this.formArray[this.currentFormIndex].value = values[0] !== "" ? values[0] : 0;
        this.totalPoints = sumBy(this.formArray, 'value') || 0;
      }
      this.formDataJsonToSave[this.currentFormIndex][this.formArray[this.currentFormIndex].form1.components[0].key] = values[0] || 0;
      this.formDataJsonToSave[this.currentFormIndex].selected = values[0] !== "" ? true : false;
      const allSelected = this.formDataJsonToSave.map((d) => {
        return d.selected
      });
      
      if (allSelected.indexOf(false) === -1) {
        this.enableSubmitButton = true;
      } else {
        this.enableSubmitButton = false;
      }

    }
  }

  onSubmitForm(event) {
    let exclude = ["selected"];
  
    let result = this.formDataJsonToSave.reduce((acc, curr) => {
      Object.entries(curr).forEach(([k, v]) => {
        if (!exclude.includes(k)) acc[`${k}`] = v;
      });
      return acc;
    }, {});


    if (!this.authService.loggedInUser) {
      const dialogRef = this.dialog.open(SurveyDialogComponent, {
        data : {
          formDataJson: result,
          formDetails: this.formDetails,
        }
      });

      dialogRef.afterClosed().subscribe(formObj => {
        this.formBuilderService.addSurveyUser(formObj).subscribe((res) => {
          console.log("This is addSurveyUser ==> ", res);
          
          if (res.alreadyExist) {
            Swal.fire(`Email already Exist` , '', 'error');
          } else {
            this.formDetails.value.formDataJson = result;
            this.formDetails.value.createdBy = res._id;
    
    
          this.formBuilderService.addformData(this.formDetails.value).subscribe((d: any) => {
            if (d) {
              Swal.fire(`${d.formname} has been Added Successfully` , '', 'success').then(() => {
                this.router.navigate(['/survey'], { queryParams: { id: d._id } });
                // this.hideAllButton = true;
                // this.mapValueWithLabel(d);
                this.summaryForm = true;
                this.createSurveySummaryTitle(this.totalPoints);

                this.getSummaryFormData(d._id);
              });
            }
          });
          }
  
        }, (err) => {
          console.log("Err ==> ", err);
        });
      });
    } else {

      this.formDetails.value.formDataJson = result;
      this.formDetails.value.formDataId = this.id || null;

      this.formBuilderService.addformData(this.formDetails.value).subscribe((d: any) => {
        if (d) {
          Swal.fire(`${d.formname} has been Added Successfully` , '', 'success').then(() => {
            this.router.navigate(['/survey'], { queryParams: { id: d._id } });
            this.summaryForm = true;
            this.createSurveySummaryTitle(this.totalPoints);
            this.id = d._id;
            this.getSummaryFormData(d._id);
            // this.hideAllButton = true;
            // this.mapValueWithLabel(d);    
          });
        }
      });
    }

  }

  createSurveySummaryTitle(points) {
    if (this.totalPoints <= 30) {
      this.surveySummaryTitle = 'Good Sleep. Improve It Better.'
    }

    if (this.totalPoints >=31 && this.totalPoints <= 50) {
      this.surveySummaryTitle = 'Poor Sleep Quality. Need Change.'
    }

    if (this.totalPoints >=51 ) {
      this.surveySummaryTitle = 'Bad Quality Of Sleep. Need Change Immediately.'
    }
  }

  mapValueWithLabel(d: any) {
    this.formJsonListSubscription = this.formBuilderService.fetchFormStructureById(this.connectedFormStructureId).subscribe((formJson) => {
      if (formJson) {
        this.form1 = formJson.formStructureJSON;
        this.fillForm = false;
        const components = keyBy(formJson.formStructureJSON.components, 'key');

        const savedData = d.formDataJson;
        let keys = Object.keys(d.formDataJson);

        keys.pop();
        keys.forEach((k) => {
          this.individualPoints.push({
            label: components[k].label,
            value: savedData[k]
          });
        });
      }
    });
  }

  onNextClick() {
    this.currentFormIndex += 1;
    this.lastFormIndex += 1;
    if (this.currentFormIndex < this.formArray.length) {
      this.form1 = this.formArray[this.currentFormIndex].form1;
    }
  }

  onBackClick() {
    this.formArray[this.currentFormIndex].value =  0;
    this.formDataJsonToSave[this.currentFormIndex][this.formArray[this.currentFormIndex].form1.components[0].key] =  0;
    this.currentFormIndex -= 1;
    this.lastFormIndex -= 1;
    this.form1 = this.formArray[this.currentFormIndex].form1;
  }

  getSummaryFormData(formDataId) {
    this.formArray = [];
    this.formDataJsonToSave = [];
    this.currentFormIndex = 0;
    this.lastFormIndex = -1;
    this.connectedFormStructureId = this.surveySummaryFormId;
    this.formJsonListSubscription = this.formBuilderService.fetchFormStructureById(this.surveySummaryFormId).subscribe((formJson) => {
      this.formBuilderService.fetchformDataById(formDataId).subscribe((res) => {

        const previousFormData = res[0].formDataJson;

        if (formJson) {
          const temp = [];
          this.formName = formJson.formname;
          formJson.formStructureJSON.components.forEach((c, i) =>{
            if (i < formJson.formStructureJSON.components.length-1) {

              if (c.properties) {
                temp.push({
                  [c.key]: Object.keys(c.properties)[0]
                })
              };

              const temp1 = {
                [c.key]: Object.keys(c.properties)[0]
              }

              if (previousFormData[temp1[c.key]] > 0) {
                this.formArray.push({
                  form1: {
                    components: [c],
                    value: this.totalPoints,
                    image: this.images[i]
                  }
                });

                this.formDataJsonToSave.push({
                  [c.key]: 0,
                  selected: false
                })
              }

            }
          });
  
          this.form1 = this.formArray[this.currentFormIndex].form1;
        
          console.log("INNNNNNNNNNNNNNNNNNN ", this.formArray, this.formDataJsonToSave);

        }

        this.formDetailsInitialization(null);
      });

    });
  }
}
