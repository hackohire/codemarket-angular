import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../core/store/state/app.state';
import { Observable } from 'rxjs';
import { Product } from '../shared/models/product.model';
import { MatTableDataSource } from '@angular/material/table';
import { HelpQuery } from '../shared/models/help-query.model';
import { MatSort } from '@angular/material';
import { UserService } from '../user/user.service';
import { PostService } from '../shared/services/post.service';
import { AuthService } from '../core/services/auth.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { MembershipService } from '../membership/membership.service';
import { Email } from '../shared/models/email.model';
import { EmailValidator } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  msbapTitle = 'Audio Title';
  msbapAudioUrl = '../../assets/audio/happy-Joel-Drazner.mp3';

  msbapDisplayTitle = false;
  msbapDisplayVolumeControls = true;

  constructor(
    private userService: UserService,
    public postService: PostService,
    public authService: AuthService,
    private membershipService: MembershipService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  // const params = this.activatedRoute.snapshot.queryParams;

}
