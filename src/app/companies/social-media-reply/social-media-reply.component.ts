import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CompanyService } from '../company.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-social-media-reply',
  templateUrl: './social-media-reply.component.html',
  styleUrls: ['./social-media-reply.component.scss']
})
export class SocialMediaReplyComponent implements OnInit {

  public socialMediaDesc: string = "";
  public companyDetail = {};

  constructor(
    public dialogRef: MatDialogRef<SocialMediaReplyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _companyService: CompanyService
    ) { }

  ngOnInit() {
    if (this.data) {
      this.companyDetail = this.data;
    } 
  }

  sendTweet() {
    this._companyService.sendTweets(this.socialMediaDesc).pipe()
      .subscribe((success) => {
        Swal.fire('Tweet has been Send Successfully', '', 'success');
        this.dialogRef.close();
        this.socialMediaDesc = "";
      });
  }

}
