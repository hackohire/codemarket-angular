import { Component, OnInit } from '@angular/core';
import { PostService } from '../../shared/services/post.service';
import { CompanyService } from '../../companies/company.service';
import { MessageService } from '../../shared/services/message.service';
import moment from 'moment';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  messagesPageNumber = 1;

  
  anonymousAvatar = '../../../../assets/images/anonymous-avatar.jpg';
  s3FilesBucketURL = environment.s3FilesBucketURL;

  constructor(
    public postService: PostService,
    public companyService: CompanyService,
    public messageService: MessageService,
    public authService: AuthService
  ) { }

  ngOnInit() {
  }

  redirectToPost(m) {
    m['__show'] = false;
    if (m.referencePost) {
      this.postService.redirectToPostDetails(m.referencePost, m._id);
    } else if (m.companyPost) {
      this.companyService.redirectToCompanyDetails(m.companyPost._id);
    }
  }

  fromNow(date) {
    const d = moment(date).isValid() ? date : new Date(+date);
    return moment(d).fromNow();
  }

}
