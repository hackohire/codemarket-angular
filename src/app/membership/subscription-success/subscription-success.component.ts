import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { BreadCumb } from '../../shared/models/bredcumb.model';

@Component({
  selector: 'app-subscription-success',
  templateUrl: './subscription-success.component.html',
  styleUrls: ['./subscription-success.component.scss']
})
export class SubscriptionSuccessComponent implements OnInit {

  planId: string;
  planDetails = environment.planDetails;
  selectedPlan;
  breadcumb: BreadCumb;

  constructor(
    private activatedRoute: ActivatedRoute
  ) {
    this.breadcumb = {
      title: 'Succesfully Subscribed',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'Membership'
        },
        {
          name: 'Success'
        }
      ]
    };
  }

  ngOnInit() {

    this.planId = this.activatedRoute.snapshot.params.planId;
    const planType = this.activatedRoute.snapshot.queryParams.planType;
    this.selectedPlan = this.planDetails[planType].find(p => p.id === this.planId);

  }

}
