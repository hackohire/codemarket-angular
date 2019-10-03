import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';
import { MembershipService } from 'src/app/membership/membership.service';
import { AuthService } from 'src/app/core/services/auth.service';
declare var paypal;

@Directive({
    selector: '[paypalSubscription]'
})
export class PaypalSubscriptionDirective implements AfterViewInit {
    @Input('paypalSubscription') planId: string;

    constructor(
        private membershipService: MembershipService,
        private authService: AuthService,
        private el: ElementRef
    ) { }

    ngAfterViewInit(): void {
        console.log(this.planId);
        paypal.Buttons({

            /** @see https://developer.paypal.com/docs/checkout/integration-features/customize-button/# */
            style: {
                layout: 'horizontal',
                color: 'blue',
                shape: 'pill',
                label: 'paypal'
            },
            createSubscription: (data, actions) => {
                console.log(data, actions);
                return actions.subscription.create({
                    plan_id: this.planId
                });
            },
            onApprove: (data, actions) => {
                console.log(data, actions);
                actions.order.get().then((details) => {
                    // Show a success message to your buyer
                    console.log(details);
                    alert('Transaction completed by ' + details.payer.name.given_name);
                });

                actions.subscription.get().then((details) => {
                    // Show a success message to your buyer
                    console.log(details);
                    details['purchasedBy'] = this.authService.loggedInUser._id;
                    // this.membershipService.saveSubscriptionIntoDatabase(details);
                });
                /** alert('You have successfully created subscription ' + data.subscriptionID); */
            },

            /** onInit is called when the button first renders */
            onInit: (data, actions) => {

                /** Disable the buttons if user is not loggedIn */
                if (!this.authService.loggedInUser) {
                    actions.disable();
                }
            },
            /** onClick is called when the button is clicked */
            onClick: async () => {

                console.log('Hello');
                /** calling this method to set current url as redirectURL after user is logged In */
                await this.authService.checkIfUserIsLoggedIn(true);
            }
        }).render(this.el.nativeElement);
    }
}
