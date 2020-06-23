import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { PostService } from '../../services/post.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { throttleTime, tap, switchMap, debounceTime, distinctUntilChanged, mapTo, findIndex } from 'rxjs/operators';
import { MatDrawer } from '@angular/material';
import { AuthService } from '../../../core/services/auth.service';
import { fromEvent } from 'rxjs/observable/fromEvent';

@Component({
  selector: 'app-chat-full-ui',
  templateUrl: './chat-full-ui.component.html',
  styleUrls: ['./chat-full-ui.component.scss']
})
export class ChatFullUiComponent implements OnInit, AfterViewInit {

  @ViewChild(CdkVirtualScrollViewport, { static: false })
  viewport: CdkVirtualScrollViewport;

  batch = 20;
  theEnd = false;

  offset = new BehaviorSubject(null);
  infinite: Observable<any[]>;

  searchString: string;

  tempPosts = [];
  searchSubject = new BehaviorSubject(null);

  @Input() loggedInUser;
  @Input() drawer: MatDrawer;

  public commentsList = [];
  public selectedPost;
  public anonymousAvatar = '../../assets/images/anonymous-avatar.jpg';

  public loginUser;
  scrolltop: number = null;
  s3FilesBucketURL = environment.s3FilesBucketURL;

  @ViewChild('searchInput', { static: true }) input: ElementRef;

  constructor(
    public postService: PostService,
    public authService: AuthService
  ) {
  }

  ngOnInit() {
    this.offset.pipe(
      throttleTime(500),
      switchMap((n) => this.getBatch(n)),
      // scan((acc, batch: any) => {
      //   return { ...acc, ...batch };
      // }, {}),
      // map(v => Object.values(v)),
      tap(list => {
        this.drawer.open();
        this.authService.navigationPostList$.next(this.authService.navigationPostList$.value.concat(list));
      }),
    ).subscribe();

    // this.infinite.subscribe();

  }

  ngAfterViewInit() {

    /** Listen to the search event */
    fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        debounceTime(400),
        distinctUntilChanged(),
        tap((v) => {
          if (true) {
            /** If search value, make the API call to fetch the data based on the search string */
            this.offset.next(0);
          } else {
            /** If no value, set the initial value */
            // this.authService.navigationPostList$.next(this.tempPosts);
          }
        }),
        findIndex((v, i) => {
          if (i === 0) {
            /** If first time event, store the list of posts */
            // this.tempPosts = this.authService.navigationPostList$.value;
          }
          if (v) {
            /** If search value */
            this.authService.navigationPostList$.next([]);
          }
          return false;
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
      this.loggedInUser._id, '', this.searchString
    ).pipe(
      tap((arr) => (arr.posts.length ? null : (this.theEnd = true))),
      map(arr => {
        return arr.posts;
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
    if (end === total && Number.isInteger(offset)) {
      this.loadBatch(offset);
    }
  }

  loadBatch(offset) {
    this.offset.next(offset);
  }

  searchAndLoad(val) {
    this.searchSubject.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      findIndex((v, i) => {
        if (i === 0) {
          this.tempPosts = this.authService.navigationPostList$.value;
        }
        this.authService.navigationPostList$.next([]);
        return v;
      }),
      mapTo(this.offset.next(0)),
    ).subscribe();
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
