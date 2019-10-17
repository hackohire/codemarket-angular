import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MembershipService } from '../membership.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import Swal, { SweetAlertType } from 'sweetalert2';

@Component({
  selector: 'app-invite-members-dialog',
  templateUrl: './invite-members-dialog.component.html',
  styleUrls: ['./invite-members-dialog.component.scss']
})
export class InviteMembersDialogComponent implements OnInit {

  usersListForm: FormGroup;
  get userList() {
    return this.usersListForm.get('list') as FormArray;
  }
  subscriptionResponse: any;
  @ViewChild('successfulInvitation', { static: false }) successfulInvitation: SwalComponent;
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<InviteMembersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private membershipService: MembershipService,
  ) { }

  ngOnInit() {
    this.usersListForm = this.fb.group({
      list: this.fb.array([])
    });
    this.addUser();
  }

  addUser() {
    if (this.userList.value.length < this.data.subscription.quantity) {
      this.userList.push(
        this.fb.group(
          {
            name: this.fb.control('', Validators.required),
            email: this.fb.control('', Validators.required)
          }
        )
      );
    } else {
      Swal.fire('Warning!', `You can only add up to ${this.data.subscription.quantity} users`, 'info')
    }
  }

  removeUser(i: number) {
    this.userList.removeAt(i);
  }

  inviteMembers() {
    this.membershipService.inviteMembersToSubscription(this.data.subscription._id, this.userList.value).subscribe({
      next: (d) => {
        console.log(d);
        if (d && d.subscriptionUsers && d.subscriptionUsers.length) {
          this.subscriptionResponse = d;
          this.successfulInvitation.confirm.subscribe(() => {
            this.dialogRef.close(d);
          });
          this.successfulInvitation.show()
        }
      }
    })
  }
  

}
