import { Component, OnInit, ViewChild } from '@angular/core';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { MembershipService } from '../membership.service';
import { InviteMembersDialogComponent } from '../invite-members-dialog/invite-members-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-membership-list',
  templateUrl: './membership-list.component.html',
  styleUrls: ['./membership-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MembershipListComponent implements OnInit {

  breadcumb: BreadCumb;
  listOfSubscriptions = [];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource = new MatTableDataSource();
  displayedColumns = ['expand', 'number', 'name', 'users', 'price', 'amount', 'action'];

  expandedMembership: any | null;

  constructor(
    private membershipService: MembershipService,
    public authService: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.breadcumb = {
      title: 'List of Subscriptions',
      path: [

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
          // this.listOfSubscriptions = list.map((l: any) => {
          //   const sub: any = {};
          //   sub.name = l.plan.nickname;
          //   sub.users = l.quantity;
          //   sub.price = l.plan.amount / 100;
          //   sub.amount = l.plan.amount / 100 * l.quantity;
          //   return sub;
          // });

          this.dataSource.data = list.slice();
        }
      }
    });
  }

  openInviteMembersDialog(subscription, i): void {
    const dialogRef = this.dialog.open(InviteMembersDialogComponent, {
      width: '500px',
      height: '550px',
      maxHeight: '700px',
      // panelClass: 'no-padding',
      data: {subscription},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.dataSource.data[i] = result;
        this.dataSource._updateChangeSubscription();
      }
      // this.animal = result;
    });
  }

  cancelSubscription(membership, i) {
    this.membershipService.cancelSubscription(membership.id).subscribe({
      next: (membership) => {
        console.log(membership);
        if (membership && membership.status === 'canceled') {
          this.dataSource.data = this.dataSource.data.splice(i, 1);
          this.dataSource._updateChangeSubscription();
          Swal.fire('Membership Subscription Canceled Successfully!', '', 'info');
        }
      }
    });
  }

}
