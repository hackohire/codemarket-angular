import { Component, OnInit } from '@angular/core';
import { FormBuilderService } from 'src/app/form-builder/form-builder.service';
import { String } from 'lodash';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss']
})
export class FormListComponent implements OnInit {

  formJsonListSubscription;
  formList;

  savedFormData = [];
  constructor(
    private formBuilderService: FormBuilderService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.formJsonListSubscription = this.formBuilderService.fetchformJson().subscribe((formJsonlist) => {
      // console.log("123 ==> ", this.authService.loggedInUser)
      // if (this.authService.loggedInUser.roles[0] === "Admin") {
      //   console.log("helo")
      // }
      this.formList = formJsonlist;
    });
  }

  formButtonClick(formStrucureId: string) {
    console.log("Form structure Id ==> ", formStrucureId);
    const paginationObj = {
      pageNumber: 1, limit: 10,
      sort: { order: '' }
    };

    this.formBuilderService.fetchSavedDataByFormStructure(paginationObj, formStrucureId).subscribe((res) => {
      this.savedFormData = res.data;
      this.savedFormData.forEach((data) => {
        data['totalPoints'] = this.calculateTotalPoints(data.formDataJson);
      })
      console.log("Rest ==> ", this.savedFormData);
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
}
