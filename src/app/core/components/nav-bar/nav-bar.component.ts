import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, share, filter, tap } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/state/app.state';
import { AuthService } from 'src/app/core/services/auth.service';
import { selectCartListLength } from '../../store/selectors/cart.selectors';
import { Router, Event, ActivationEnd, RouterStateSnapshot, NavigationEnd } from '@angular/router';
import { MatDialog, MatAnchor } from '@angular/material';
import { SearchComponent } from '../search/search.component';
import { PostType } from '../../../shared/models/post-types.enum';
import { MessageService } from '../../../shared/services/message.service';
import { PostService } from '../../../shared/services/post.service';
import { appConstants } from '../../../shared/constants/app_constants';
import { Post } from '../../../shared/models/post.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit, OnDestroy {

  @ViewChild('lr', { static: false }) lr: MatAnchor;
  postTypes = PostType;

  postTypesArray = appConstants.postTypesArray;

  hideFooter = false;
  showPostActions = true;

  listOfConnectedPosts: { posts: Post[], total?: number } = { posts: [] };
  totalConnectedPosts: number;

  loggedInUser: User;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      share()
    );

  cartListLength: Observable<number>;

  private subscription: Subscription = new Subscription();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store<AppState>,
    public authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    public messageService: MessageService,
    public postService: PostService,
    public location: Location
  ) {

    this.subscription.add(
      this.router.events.pipe(
        filter((e) => (e instanceof NavigationEnd)),
        tap((r: NavigationEnd) => {
          console.log(r.url.includes('post'));
          this.hideFooter = r.url.includes('post');
          this.showPostActions = r.url.includes('add-post?type=');
        }))
        .subscribe(),
    );

  }

  ngOnInit() {
    this.subscription.add(
      this.authService.loggedInUser$
        .subscribe(u => {
          if (u) {
            // this.ref.detach();
            this.loggedInUser = { ...u };
            this.getConnectedPosts(u);
            // this.ref.detectChanges();
          } else {
            this.loggedInUser = u;
          }

        })
    );

    this.cartListLength = this.store.select(selectCartListLength);

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  login() {
    // const dialogRef = this.dialog.open(AuthDialogComponent, {
    //   // panelClass: 'no-padding',
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
    // this.authService.login();
  }

  getConnectedPosts(user) {
    this.postService.getAllPosts(
      {
        pageNumber: 1, limit: 10,
        sort: { order: '' }
      }, '', '', '',
      user._id
    ).subscribe((u) => {
      this.listOfConnectedPosts.posts = u.posts;
      this.totalConnectedPosts = u.total;
    });

  }

  logout() {
    this.authService.logout();
  }

  redirect() {
    this.router.navigate(['/']);
  }

  isUnread(messages) {
    return messages.find(m => m.__show);
  }

  openSearchDialog(): void {
    const dialogRef = this.dialog.open(SearchComponent, {
      panelClass: 'no-padding',
      disableClose: false
    });
  }
}
