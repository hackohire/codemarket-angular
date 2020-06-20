import { Component, OnInit } from '@angular/core';
import { FormBuilderService } from 'src/app/form-builder/form-builder.service';
import { String } from 'lodash';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatPaginator } from '@angular/material/paginator';

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
  constructor(
    private formBuilderService: FormBuilderService,
    private authService: AuthService
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
    console.log("123 ==> ", id);
  }
}
