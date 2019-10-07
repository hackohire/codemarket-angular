import { Component, OnInit } from '@angular/core';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { MembershipService } from '../membership.service';

@Component({
  selector: 'app-membership-list',
  templateUrl: './membership-list.component.html',
  styleUrls: ['./membership-list.component.scss']
})
export class MembershipListComponent implements OnInit {

  breadcumb: BreadCumb;
  listOfSubscriptions = [];

  constructor(
    private membershipService: MembershipService
  ) { }

  ngOnInit() {
    this.breadcumb = {
      title: 'List of Subscriptions',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'My Profile',
          // pathString: '/'
        },
        {
          name: 'Membership'
        }
      ]
    };

    this.membershipService.getMembershipSubscriptionsByUserId().subscribe({
      next: (list: []) => {
        if (list && list.length) {
          this.listOfSubscriptions = list.map((l: any) => {
            const sub: any = {};
            sub.name = l.plan.nickname;
            sub.users = l.quantity;
            sub.price = l.plan.amount / 100;
            sub.amount = l.plan.amount / 100 * l.quantity;
            return sub;
          });
        }
      }
    });
  }

}
