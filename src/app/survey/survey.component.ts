import { Component, OnInit } from '@angular/core';
import { FormBuilderService } from '../form-builder/form-builder.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../core/services/auth.service';
import { keyBy, sumBy } from 'lodash';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {

  formName = 'Sleep Survey';
  connectedFormStructureId = '';
  connectedFormDataId = '';
  formJsonListSubscription: Subscription;
  formDetails: FormGroup;
  public form1 = { components: [] };
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

  constructor(
    private formBuilderService: FormBuilderService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    ) { 
      this.connectedFormStructureId = '5ee1fad4be0ca353ff5caa45';
    }

  ngOnInit() {
    this.formJsonListSubscription = this.formBuilderService.fetchFormStructureById(this.connectedFormStructureId).subscribe((formJson) => {
      if (formJson) {

        formJson.formStructureJSON.components.forEach((c, i) =>{
          if (i < formJson.formStructureJSON.components.length-1) {
            this.formArray.push({
              form1: {
                components: [c],
                value: this.totalPoints
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


    this.id = this.activatedRoute.snapshot.queryParams.id || '';
    if(this.id !== '') {
      console.log("Id ==> ", this.id);
      this.formBuilderService.fetchformDataById(this.id).subscribe((res) => {
        const values = Object.values(res[0].formDataJson);
        values.forEach((v: any) => {
          if (parseInt(v)) {
            this.totalPoints += v;
          }
        });
        this.mapValueWithLabel(res[0]);
      });
    }
  }

  formDetailsInitialization(i: any) {
    this.formDetails = new FormGroup({
      formname: new FormControl(i && i.formname ? i.formname : this.formName, Validators.required),
      formDataJson: new FormControl(i && i.jsonstring ? i.jsonstring : '', Validators.required),
      connectedFormStructureId: new FormControl(i && i._id ? i._id : this.connectedFormStructureId),
      createdBy: new FormControl(this.authService.loggedInUser._id)
    });
  }

  valueChangeFun(event) {
    if (event.data) {
      const values : any= Object.values(event.data);
      this.totalPoints = 0;
      // values.forEach((i: any) => {
      //   if (parseInt(i)) {
      //     this.totalPoints += i;
      //   }
      // });

      this.formArray[this.currentFormIndex].value = values[0] !== "" ? values[0] : 0;
      this.totalPoints = sumBy(this.formArray, 'value') || 0;
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
    if (!this.authService.loggedInUser) {
      this.authService.checkIfUserIsLoggedIn(true);
      return;
    }
    // console.log("234", event);
    // this.formDetails.value.formDataJson = event.data;

    let exclude = ["selected"];

    let result = this.formDataJsonToSave.reduce((acc, curr) => {
      Object.entries(curr).forEach(([k, v]) => {
        if (!exclude.includes(k)) acc[`${k}`] = v;
      });
      return acc;
    }, {});

    this.formDetails.value.formDataJson = result;

    this.formBuilderService.addformData(this.formDetails.value).subscribe((d: any) => {
      if (d) {
        Swal.fire(`${d.formname} has been Added Successfully` , '', 'success').then(() => {
          this.router.navigate(['/survey'], { queryParams: { id: d._id } });
          this.hideAllButton = true;
          this.mapValueWithLabel(d);    
        });
      }
    });
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
}
