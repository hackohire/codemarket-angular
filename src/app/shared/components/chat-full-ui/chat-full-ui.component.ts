import { Component, OnInit, Input, ViewChild } from '@angular/core';
import moment from 'moment';
import { environment } from '../../../../environments/environment';
import { PostService } from '../../services/post.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
<<<<<<< HEAD
import { Post } from '../../models/post.model';
import { throttleTime, mergeMap, scan, tap } from 'rxjs/operators';
import { MatDrawer } from '@angular/material';
=======
import { throttleTime, mergeMap, scan, tap, first } from 'rxjs/operators';
import { MatDrawer } from '@angular/material';
import { AuthService } from '../../../core/services/auth.service';
>>>>>>> 345937bb8b4542e1fa25846426281a9fccb72c05

@Component({
  selector: 'app-chat-full-ui',
  templateUrl: './chat-full-ui.component.html',
  styleUrls: ['./chat-full-ui.component.scss']
})
export class ChatFullUiComponent implements OnInit {

  @ViewChild(CdkVirtualScrollViewport, { static: false })
  viewport: CdkVirtualScrollViewport;

  batch = 20;
  theEnd = false;

  offset = new BehaviorSubject(null);
  infinite: Observable<any[]>;

  @Input() loggedInUser;
  @Input() drawer: MatDrawer;

  public commentsList = [];
  public selectedPost;
  public anonymousAvatar = '../../assets/images/anonymous-avatar.jpg';
  public username = '';
  public chatToken = '';
  public channelName = '';
  public channelStatus = '';
  public chatClient: any;
  public generalChannel: any;
  public msg: any;
  public loadingMessage = '';
  public loginUser;
  scrolltop: number = null;
  s3FilesBucketURL = environment.s3FilesBucketURL;
  constructor(
    public postService: PostService,
    public authService: AuthService
  ) {
  }

  ngOnInit() {
    this.offset.pipe(
      throttleTime(500),
      mergeMap((n) => this.getBatch(n)),
      scan((acc, batch: any) => {
        return { ...acc, ...batch };
      }, {}),
      map(v => Object.values(v)),
      tap(list => {
        console.log(list);
        this.drawer.open();
        this.authService.navigationPostList$.next(list);
      }),
    ).subscribe();
  }


  /** Fetch the list of posts based on the scroll */
  getBatch(offset) {
    console.log(offset);
    return this.postService.getAllPosts(
      {
        pageNumber: offset + 1, limit: 10,
        sort: { order: '' }
      }, '', '', '',
      this.loggedInUser._id
    ).pipe(
      tap((arr) => (arr.posts.length ? null : (this.theEnd = true))),
      map(arr => {
        return arr.posts.reduce((acc, cur) => {
          const id = cur._id;
          const data = cur;
          return { ...acc, [id]: data };
        }, {});
      })
    );
  }

  /** If at end, stop, otherwise, end === total, fetch next batch */
  nextBatch(e, offset) {
    if (this.theEnd) {
      return;
    }

    const end = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();
    // console.log(`${end}, '>=', ${total}`);
    if (end === total) {
      this.offset.next(offset);
    }
  }

  openPostChat(index: number) {
  }

  createTwilioToken() {

  }

  createOrJoinGeneralChannel(channel_id) {
  }

  setupChannel() {
  }

  sendMsg() {
  }

  getFormatedDate(datetime) {
    if (moment().format('DD MMM YYYY') === moment(datetime).format('DD MMM YYYY')) {
      return moment(datetime).format('hh:mm A');
    } else {
      return moment(datetime).format('hh:mm A') + ' ' + moment(datetime).format('DD MMM YYYY');
    }
  }

  trackByIdx(i) {
    return i;
  }

  onClickPost(post) {
    this.postService.redirectToPostDetails(post);
    if (post['isLatest']) {
      this.authService.postUpdateCount--;
    }
    post['isLatest'] = false;
    this.postService.closeNavigationIfMobile(this.drawer);
  }

}
