import { Component, OnInit } from '@angular/core';
import { FormBuilderService } from '../form-builder/form-builder.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../core/services/auth.service';
import { keyBy } from 'lodash';

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

  fillForm = true;
  individualPoints =[];

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
        this.form1 = formJson.formStructureJSON;
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
    const values = Object.values(event.data);
    this.totalPoints = 0;
    values.forEach((i: any) => {
      if (parseInt(i)) {
        this.totalPoints += i;
      }
    })  
  }

  onSubmitForm(event) {
    if (!this.authService.loggedInUser) {
      this.authService.checkIfUserIsLoggedIn(true);
      return;
    }
    console.log("234", event);
    this.formDetails.value.formDataJson = event.data;

    

    this.formBuilderService.addformData(this.formDetails.value).subscribe((d: any) => {
      if (d) {
        Swal.fire(`${d.formname} has been Added Successfully` , '', 'success').then(() => {
          this.router.navigate(['/survey'], { queryParams: { id: d._id } });
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
}
