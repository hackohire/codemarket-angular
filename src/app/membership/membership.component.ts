import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MembershipService } from './membership.service';
import { BreadCumb } from '../shared/models/bredcumb.model';
import { plans } from '../shared/constants/plan_details';
import { AuthService } from '../core/services/auth.service';
declare var paypal;

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.scss']
})
export class MembershipComponent implements OnInit {

  breadcumb: BreadCumb;
  listOfPlans = plans;
  @ViewChild('subscribeButton', { static: false }) subscribeButton: ElementRef;

  constructor(
    public memborshipService: MembershipService,
    public authService: AuthService
  ) {
    this.breadcumb = {
      title: 'Subscription based On-demand leadership training for sofwtare engineers and software teams',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'Membership'
        }
      ]
    };
  }

  ngOnInit() {
    this.memborshipService.generatePaypalOauth2Token();
    this.createPaypalSubscriptionButton();
  }

  createPaypalSubscriptionButton() {
    setTimeout(() => {
      if (this.subscribeButton && this.subscribeButton.nativeElement) {
        paypal.Buttons({
          createSubscription: (data, actions) => {
            console.log(data, actions);
            return actions.subscription.create({
              plan_id: 'P-6WS74521Y1808750PLWENKCQ'
            });

          },
          onApprove: (data, actions) => {
            console.log(data, actions);
            return actions.order.get().then((details)  => {
              // Show a success message to your buyer
              console.log(details);
              alert('Transaction completed by ' + details.payer.name.given_name);
            });
            // alert('You have successfully created subscription ' + data.subscriptionID);
          }
        }).render(this.subscribeButton.nativeElement);
      }
    }, 0);
  }

}
