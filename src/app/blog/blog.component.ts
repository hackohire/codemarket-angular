import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  isShowDiv1 = true;
  isShowDiv2 = true;
  isShowDiv3 = true;
   
  toggleDisplayDiv1() {this.isShowDiv1 = !this.isShowDiv1;}   
  toggleDisplayDiv2() {this.isShowDiv2 = !this.isShowDiv2;}
  toggleDisplayDiv3() {this.isShowDiv3 = !this.isShowDiv3;}

}