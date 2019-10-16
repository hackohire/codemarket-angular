import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { retry, map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { SweetalertService } from '../shared/services/sweetalert.service';
import { AuthService } from '../core/services/auth.service';
declare var paypal;

@Injectable({
  providedIn: 'root'
})
export class MembershipService {

  paypalConfig;

  constructor(
    private httpClient: HttpClient,
    private apollo: Apollo,
    private sweetAlertService: SweetalertService,
    private authService: AuthService,
  ) { }


  /** FOR INTERNAL USE ONLY */
  /** Generate "access_token" by authenticating with paypal using @clientId & @secret */
  /** @see https://developer.paypal.com/docs/api/get-an-access-token-postman/ */

  // generatePaypalOauth2Token() {
  //   this.paypalConfig = JSON.parse(this.getPaypalConfig());
  //   if (!this.paypalConfig) {

  //     const urlSearchParams = new URLSearchParams();
  //     urlSearchParams.set('grant_type', 'client_credentials');
  //     const body = urlSearchParams.toString();

  //     const httpOptions = {
  //       headers: new HttpHeaders({
  //         'Content-Type': 'application/x-www-form-urlencoded',
  //         Authorization: 'Basic ' + btoa(`${environment.paypalClientId}:${environment.paypalSecret}`)
  //       })
  //     };

  //     this.httpClient.post(`${environment.paypalSandbox}/v1/oauth2/token`, body, httpOptions)
  //       .pipe(
  //         retry(1)
  //       )
  //       .subscribe((res) => {
  //         this.paypalConfig = res;
  //         localStorage.setItem('paypalConfig', JSON.stringify(res));
  //       });
  //   }
  // }


  /** FOR INTERNAL USE ONLY */
  /** Create Product on Paypal Subcription */
  /** @see https://developer.paypal.com/docs/subscriptions/integrate/#2-create-a-product */

  // createProduct() {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       Authorization: 'Bearer ' + JSON.parse(this.getPaypalConfig()).access_token
  //     })
  //   };

  //   const body = {
  //     name: 'Monthly Events For Developers',
  //     description: 'Connecting with the developers / tech experts / co-founders',
  //     type: 'SERVICE',
  //     category: 'Networking',
  //     image_url: '',
  //     home_url: ''
  //   };

  //   this.httpClient.post(`${environment.paypalSandbox}/v1/catalogs/products`, body, httpOptions)
  //     .subscribe((res) => {
  //       console.log(res);
  //     });
  // }

  /** FOR INTERNAL USE ONLY */
  /** Create Plans for the products you have created on Paypal Subcription */
  /** @see https://developer.paypal.com/docs/subscriptions/integrate/#3-create-a-plan */

  // createPlan() {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       Accept: 'application/json',
  //       Prefer: 'return=representation',
  //       Authorization: 'Bearer ' + JSON.parse(this.getPaypalConfig()).access_token
  //     })
  //   };

  //   const plan = {
  //     product_id: 'PROD-6XB24663H4094933M',
  //     name: 'Ambition Plan',
  //     description: 'Ambition plan',
  //     billing_cycles: [
  //       {
  //         frequency: {
  //           interval_unit: 'MONTH',
  //           interval_count: 1
  //         },
  //         tenure_type: 'TRIAL',
  //         sequence: 1,
  //         total_cycles: 1
  //       },
  //       {
  //         frequency: {
  //           interval_unit: 'MONTH',
  //           interval_count: 1
  //         },
  //         tenure_type: 'REGULAR',
  //         sequence: 2,
  //         total_cycles: 12,
  //         pricing_scheme: {
  //           fixed_price: {
  //             value: '10',
  //             currency_code: 'USD'
  //           }
  //         }
  //       }
  //     ],
  //     payment_preferences: {
  //       auto_bill_outstanding: true,
  //       setup_fee: {
  //         value: '10',
  //         currency_code: 'USD'
  //       },
  //       setup_fee_failure_action: 'CONTINUE',
  //       payment_failure_threshold: 3
  //     },
  //     taxes: {
  //       percentage: '10',
  //       inclusive: false
  //     }
  //   };

  //   this.httpClient.post(`${environment.paypalSandbox}/v1/catalogs/products`, plan, httpOptions)
  //     .subscribe((res) => {
  //       console.log(res);
  //     });
  // }

  /** List the plans of the products you have created on Paypal Subcription */
  /** @see https://developer.paypal.com/docs/subscriptions/full-integration/plan-management/#list-plans */
  // listPlans() {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       Authorization: 'Bearer ' + JSON.parse(this.getPaypalConfig()).access_token
  //     })
  //   };

  //   return this.httpClient.get(`${environment.paypalSandbox}/v1/billing/plans`, httpOptions);
  // }


  /** Get the details of the plan */
  /** @see https://developer.paypal.com/docs/subscriptions/full-integration/plan-management/#show-plan-details */
  // getPlanDetails(planId: string) {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       Authorization: 'Bearer ' + JSON.parse(this.getPaypalConfig()).access_token
  //     })
  //   };

  //   return this.httpClient.get(`${environment.paypalSandbox}/v1/billing/plans/${planId}`, httpOptions).subscribe({
  //     next: (p) => p
  //   });

  // }

  // getPaypalConfig(): string {
  //   return localStorage.getItem('paypalConfig');
  // }

  // saveSubscriptionIntoDatabase(subscription) {
  //   return this.apollo.mutate(
  //     {
  //       mutation: gql`
  //           mutation addMembershipSubscription($subscription: PaypalSubscriptionInput) {
  //             addMembershipSubscription(subscription: $subscription) {
  //               plan_id
  //               purchasedBy {
  //                 name
  //                 avatar
  //                 _id
  //               }
  //               id
  //             }
  //           }
  //         `,
  //       variables: {
  //         subscription: subscription
  //       }
  //     }
  //   ).pipe(
  //     map((p: any) => {
  //       return p.data.addMembershipSubscription;
  //     })
  //   ).subscribe((sub) => {
  //     console.log(sub);
  //     this.sweetAlertService.success('You have successfully subscribed', '', 'success');
  //   });
  // }

  createStripeUser() {
    return this.httpClient.post(environment.serverless_url + 'createStripeUser',
    {
      loggedInUserId: this.authService.loggedInUser._id,
      email: this.authService.loggedInUser.email,
      name: this.authService.loggedInUser.name
    })
    .toPromise().then((d: any) => {
      console.log(d);
      if (d) {
        return d;
      }
    });
  }

  async attachCardAndCreateSubscription(source, stripeId: string, trial_period_days: number, metadata, items) {
    const d = await this.httpClient.post(environment.serverless_url + 'attachCardAndCreateSubscription', {
      loggedInUserId: this.authService.loggedInUser._id,
      items,
      stripeId,
      trial_period_days,
      metadata,
      source,
      name: this.authService.loggedInUser.name
    }).toPromise();
    console.log(d);
    if (d) {
      return d;
    }
  }

  getMembershipSubscriptionsByUserId() {
    return this.apollo.query(
      {
        query: gql`
          query getMembershipSubscriptionsByUserId($userId: String) {
            getMembershipSubscriptionsByUserId(userId: $userId) {
              plan {
                nickname
                amount
                id
              }
              metadata {
                userId {
                  name
                  _id
                }
              }
              subscriptionUsers {
                name
                email
                invitationAccepted
              }
              quantity
              id
              _id
              status
            }
          }
        `,
        variables: {
          userId: this.authService.loggedInUser._id,
        },
        fetchPolicy: 'no-cache'
      },
    ).pipe(
      map((p: any) => {
        return p.data.getMembershipSubscriptionsByUserId;
      }),
    );
  }

  inviteMembersToSubscription(subscriptionId, users) {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation inviteMembersToSubscription($subscriptionId: String, $users: [SubscriptionUsersInput]) {
            inviteMembersToSubscription(subscriptionId: $subscriptionId, users: $users) {
              plan {
                nickname
                amount
                id
              }
              subscriptionUsers {
                name
                email
                invitationAccepted
              }
              quantity
              id
              _id
            }
          }
        `,
        variables: {
          subscriptionId,
          users,
        },
      },
    ).pipe(
      map((p: any) => {
        return p.data.inviteMembersToSubscription;
      }),
    );
  }

  acceptInvitation(subscriptionId, email) {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation acceptInvitation($subscriptionId: String, $email: String) {
            acceptInvitation(subscriptionId: $subscriptionId, email: $email) {
              subscriptionUsers {
                name
                email
                invitationAccepted
              }
              _id
            }
          }
        `,
        variables: {
          subscriptionId,
          email,
        },
      },
    ).pipe(
      map((p: any) => {
        return p.data.acceptInvitation;
      }),
    );
  }

  cancelSubscription(subscriptionId: string) {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation cancelSubscription($subscriptionId: String) {
            cancelSubscription(subscriptionId: $subscriptionId) {
              plan {
                nickname
                amount
                id
              }
              subscriptionUsers {
                name
                email
                invitationAccepted
              }
              quantity
              id
              _id
            }
          }
        `,
        variables: {
          subscriptionId,
        },
      },
    ).pipe(
      map((p: any) => {
        return p.data.cancelSubscription;
      }),
    );
  }
}
