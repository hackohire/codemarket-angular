import { Component, OnInit, Inject, PLATFORM_ID, Input } from '@angular/core';
import { FormBuilderService } from '../form-builder/form-builder.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { catchError, } from 'rxjs/operators';
import { of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatDialogConfig } from '@angular/material';

@Component({
  selector: 'app-dpr',
  templateUrl: './dpr.component.html',
  styleUrls: ['./dpr.component.scss']
})
export class DprComponent implements OnInit {

  formName = '';
  connectedFormStructureId = '';
  @Input() companyId = '';
  connectedFormDataId = '';
  form1Data = null;
  location = '';
  programCount = '';

  constructor(
    public dialog: MatDialog,
    private formBuilderService: FormBuilderService,
    private activatedRoute: ActivatedRoute,
    @Inject(PLATFORM_ID) private _platformId) {
    this.companyId = this.activatedRoute.snapshot.params['companyId'];
    this.formName = 'Eligibility';
    this.connectedFormStructureId = '5eb3a8efa83c7d1778526205';
  }

  formJsonListSubscription: Subscription;
  programListSubscription: Subscription;

  public form1 = { components: [] };
  formDetails: FormGroup;

  ngOnInit() {
    this.formJsonListSubscription = this.formBuilderService.fetchFormStructureById(this.connectedFormStructureId).subscribe((formJson) => {
      if (formJson) {
        this.form1 = formJson.formStructureJSON;
      }
      this.formDetailsInitialization(null);
    });
  }

  formDetailsInitialization(i: any) {
    this.formDetails = new FormGroup({
      formname: new FormControl(i && i.formname ? i.formname : this.formName, Validators.required),
      formDataJson: new FormControl(i && i.jsonstring ? i.jsonstring : '', Validators.required),
      connectedFormStructureId: new FormControl(i && i._id ? i._id : this.connectedFormStructureId),
      company: new FormGroup({
        _id: new FormControl(i && i._id ? i._id : this.companyId),
      })
    });
  }

  onChange(event) {
    console.log(event.data);
    if (Object.keys(event.data).length && !this.dialog.openDialogs.length) {
      this.form1Data = {...event.data};
      if (event.data.inANeighborhoodCityOrCountyGeneralAreaStartTypingForAMenuOfOptions.value !== this.location) {
        this.programListSubscription = this.formBuilderService.fetchHomeBuyerProgram(event.data.inANeighborhoodCityOrCountyGeneralAreaStartTypingForAMenuOfOptions.value).subscribe((Programmlist) => {
          this.programCount = Programmlist.length;
        });
      }
    }
  }

  onSubmitForm1(event) {
    console.log(event.data);
    this.openDialog();

    // this.formDetails.value.formDataJson = event.data;

    // this.formBuilderService.addformData(this.formDetails.value).pipe(
    //   catchError((e) => {
    //     return of(false);
    //   })
    // ).subscribe((d: any) => {
    //   if (d) {
    //     Swal.fire(`${d.formname} has been Added Successfully`, '', 'success').then(() => {
    //       this.openDialog();
    //     });
    //   }
    // });
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      companyId: this.companyId,
      form1Data: this.form1Data,
      programCount: this.programCount
    };

    const dialogRef = this.dialog.open(FormDetailsDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  isBrowser() {
    return isPlatformBrowser(this._platformId);
  }

}


@Component({
  selector: 'form-details-dialog.html',
  templateUrl: './form-details-dialog.html',
})
export class FormDetailsDialog {

  getDetails = '';
  getDetilsConnectedFormStructureId = '';
  companyId = '';
  connectedFormDataId = '';
  form1Data = {};
  programCount = '';

  formJsonListSubscription1: Subscription;
  public form2 = { components: [] };
  formDetailsForm: FormGroup;
  bankFormDataRef: FormGroup;


  constructor(
    public dialogRef: MatDialogRef<FormDetailsDialog>,
    private formBuilderService: FormBuilderService,
    @Inject(PLATFORM_ID) private _platformId,
    @Inject(MAT_DIALOG_DATA) data,
    private router: Router, ) {
    this.companyId = data.companyId;
    this.form1Data = data.form1Data;
    this.programCount = data.programCount;
    this.getDetails = 'Getdetails';
    this.getDetilsConnectedFormStructureId = '5eb409c53a429f353b3d8b0b';

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  formDetailsInitializationDetailsForm(i: any) {
    this.formDetailsForm = new FormGroup({
      formname: new FormControl(i && i.formname ? i.formname : this.getDetails, Validators.required),
      formDataJson: new FormControl(i && i.jsonstring ? i.jsonstring : '', Validators.required),
      connectedFormStructureId: new FormControl(i && i._id ? i._id : this.getDetilsConnectedFormStructureId),
      company: new FormGroup({
        _id: new FormControl(i && i._id ? i._id : this.companyId),
      })
    });
  }


  ngOnInit() {
    this.formJsonListSubscription1 = this.formBuilderService.fetchFormStructureById(this.getDetilsConnectedFormStructureId).subscribe((formJson) => {
      if (formJson) {
        this.form2 = formJson.formStructureJSON;
      }
      this.formDetailsInitializationDetailsForm(null);
    });
  }

  onSubmitForm(event) {
    console.log(event.data);
    this.formDetailsForm.value.formDataJson = { ...event.data, ...this.form1Data };

    this.formBuilderService.addformData(this.formDetailsForm.value).pipe(
      catchError((e) => {
        return of(false);
      })
    ).subscribe((d: any) => {
      if (d) {
        Swal.fire(`Thanks ! Team Will Connect You Shourtly.`, '', 'success').then(() => {
          // Need To send Mail To Bank with the details
          this.dialogRef.close();
          this.router.navigate(['/', 'program-list', d._id]);
        });
      }
    });
  }

  isBrowser() {
    return isPlatformBrowser(this._platformId);
  }

}
