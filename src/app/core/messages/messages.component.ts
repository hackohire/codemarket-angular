import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../../shared/services/post.service';
import { CompanyService } from '../../companies/company.service';
import { MessageService } from '../../shared/services/message.service';
import moment from 'moment';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { trigger, transition, query, stagger, animate, style, state } from '@angular/animations';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ]),
  ]
})
export class MessagesComponent implements OnInit, OnDestroy {

  messagesPageNumber = 1;

  anonymousAvatar = '../../../../assets/images/anonymous-avatar.jpg';
  s3FilesBucketURL = environment.s3FilesBucketURL;
  subscription$ = new Subscription();
  uniqueDatesArray = [];

  constructor(
    public postService: PostService,
    public companyService: CompanyService,
    public messageService: MessageService,
    public authService: AuthService
  ) { }

  ngOnInit() {

    /** Finding the different dates and putting it into the array to show messages based on the comments */
    this.subscription$.add(
      this.messageService.messagesList$.subscribe(mList => {
        if (mList.messages && mList.messages.length) {
          console.log(new Date(+(mList.messages[0].createdAt)).toISOString());
          this.uniqueDatesArray = [...new Set(mList.messages.map(item => new Date(+(item.createdAt)).toISOString().split('T')[0]))];
        }
        console.log(this.uniqueDatesArray);
      })
    );
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  redirectToPost(m) {
    m['__show'] = false;
    if (m.referencePost) {
      this.postService.redirectToPostDetails(m.referencePost, m._id);
    } else if (m.companyPost) {
      this.companyService.redirectToCompanyDetails(m.companyPost._id);
    }
  }

  convertDate(d) {
    return new Date(+d).toISOString().split('T')[0];
  }

  fromNow(date) {
    const d = moment(date).isValid() ? date : new Date(+date);
    return moment(d).fromNow();
  }

}
