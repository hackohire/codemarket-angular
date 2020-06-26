import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {FormBuilderService} from './form-builder.service';
import { Subscription } from 'rxjs';
import { BreadCumb } from './../shared/models/bredcumb.model';
import { MatTableDataSource } from '@angular/material';
import { AuthService } from '../core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetalertService } from '../shared/services/sweetalert.service';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent implements OnInit {
  formDetails: FormGroup;
  public form1 = {components: []};

  displayedColumns: string[];
  dataSource = new MatTableDataSource();
  breadcumb: BreadCumb;

  formJsonListSubscription: Subscription;
  all = false;

  constructor(private formBuilderService: FormBuilderService,
    @Inject(PLATFORM_ID) private _platformId: Object,
    private authService: AuthService,
    private router: Router,
    private sweetAlertService: SweetalertService,
    private activatedRoute: ActivatedRoute
   ) {
  }

  ngOnInit() {

    this.all = this.activatedRoute.snapshot.queryParams.all;

    this.authService.loggedInUser$.subscribe(u => {
      if (u) {
        if (this.all) {
          this.formJsonListSubscription = this.formBuilderService.fetchformJson('').subscribe((formJsonlist) => {
            this.displayedColumns = ['formName', 'action'];
            this.dataSource.data = formJsonlist;
          });
        } else {
          this.formJsonListSubscription = this.formBuilderService.fetchformJson(this.authService.loggedInUser._id).subscribe((formJsonlist) => {
            this.displayedColumns = ['formName', 'action'];
            this.dataSource.data = formJsonlist;
          });
        }
      } else {
        this.authService.checkIfUserIsLoggedIn(true);
        return;
      }
    });

    this.breadcumb = {
      title: 'Form Template List',
    };

    
  }

  onSubmitForm1(event) {
    console.log(event.data);
  }

  deleteFormJson(formId) {
    this.sweetAlertService.confirmDelete(() => {
      this.formBuilderService.deleteFormJson(formId).subscribe((deleted) => {
        if (deleted) {
          this.dataSource.data = this.dataSource.data.filter((d: any) => d._id !== formId);
        }
      });
    });

  }
}
