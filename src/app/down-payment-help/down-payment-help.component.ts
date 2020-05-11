import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import {FormBuilderService} from '../form-builder/form-builder.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { catchError, } from 'rxjs/operators';
import { of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-down-payment-help',
  templateUrl: './down-payment-help.component.html',
  styleUrls: ['./down-payment-help.component.scss']
})
export class DownPaymentHelpComponent implements OnInit {

  formName = '';
  connectedFormStructureId = '';

  constructor(
    public dialog: MatDialog,
    private formBuilderService: FormBuilderService,
    private activatedRoute: ActivatedRoute,
    @Inject(PLATFORM_ID) private _platformId) {
    this.formName = 'Eligibility';
    this.connectedFormStructureId = '5eb3a8efa83c7d1778526205';
  }

  formJsonListSubscription: Subscription;
  
  public form1 = {components: []};
  formDetails: FormGroup;
 


  ngOnInit() {
    this.formJsonListSubscription = this.formBuilderService.fetchformJson().subscribe((formJsonlist) => {
      if (formJsonlist && formJsonlist.length) {
        this.form1 = formJsonlist.find(form => form._id === this.connectedFormStructureId).formStructureJSON;
      }
      this.formDetailsInitialization(null);
    });
  }

  formDetailsInitialization(i: any) {
    this.formDetails = new FormGroup({
      formname: new FormControl(i && i.formname ? i.formname : this.formName, Validators.required),
      formDataJson: new FormControl(i && i.jsonstring ? i.jsonstring : '', Validators.required),
      connectedFormStructureId: new FormControl(i && i._id ? i._id : this.connectedFormStructureId)
    });
  }

  onSubmitForm1(event) {
    console.log(event.data);
    this.formDetails.value.formDataJson = event.data;

    this.formBuilderService.addformData(this.formDetails.value).pipe(
      catchError((e) => {
        console.log(e);
        return of(false);
      })
    ).subscribe((d: any) => {
      if (d) {
        Swal.fire(`${d.formname} has been Added Successfully`, '', 'success').then(() => {
          this.openDialog();
        });
      }
    });
  }



  openDialog() {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


  isBrowser() {
    return isPlatformBrowser(this._platformId);
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {

  getDetails= '';
  getDetilsConnectedFormStructureId = '';
  formJsonListSubscription1: Subscription;
  public form2 = {components: []};
  formDetailsForm: FormGroup;
  

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
     private formBuilderService: FormBuilderService,
     @Inject(PLATFORM_ID) private _platformId,
     private router: Router,) {
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
      connectedFormStructureId: new FormControl(i && i._id ? i._id : this.getDetilsConnectedFormStructureId)
    });
  }

  ngOnInit() {
    this.formJsonListSubscription1 = this.formBuilderService.fetchformJson().subscribe((formJsonlist) => {
      if (formJsonlist && formJsonlist.length) {
        this.form2 = formJsonlist.find(form => form._id === this.getDetilsConnectedFormStructureId).formStructureJSON;
      }
      this.formDetailsInitializationDetailsForm(null);
    });
  }

  onSubmitForm(event) {
    console.log(event.data);
    this.formDetailsForm.value.formDataJson = event.data;

    this.formBuilderService.addformData(this.formDetailsForm.value).pipe(
      catchError((e) => {
        console.log(e);
        return of(false);
      })
    ).subscribe((d: any) => {
      if (d) {
        Swal.fire(`${d.formname} has been Added Successfully`, '', 'success').then(() => {
          this.dialogRef.close();
          this.router.navigate(['/', 'program-list']);
        });
      }
    });
  }

  isBrowser() {
    return isPlatformBrowser(this._platformId);
  }

}