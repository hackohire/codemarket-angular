import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, share, filter, tap } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/state/app.state';
import { AuthService } from 'src/app/core/services/auth.service';
import { selectCartListLength } from '../../store/selectors/cart.selectors';
import { Router, Event, ActivationEnd, RouterStateSnapshot, NavigationEnd } from '@angular/router';
import { MatDialog, MatAnchor, MatDrawer } from '@angular/material';
import { SearchComponent } from '../search/search.component';
import { droEmails, emails, la2050Emails, therapistEmails } from '../../../emails';
import { newBniEmails, womenBizEmails, cityEmails, cocSmEmail, linkedInEmails } from '../../../newEmails';
import { realEstateEmail, accountEmails, juryEmails, dentistEmails, newTherapistEmail, finalInstaEmails } from '../../../dentist-acc-realestate-emails';
import { Validators, FormControl } from '@angular/forms';
import { PostType } from '../../../shared/models/post-types.enum';
import { MessageService } from '../../../shared/services/message.service';
import { PostService } from '../../../shared/services/post.service';
import { appConstants } from '../../../shared/constants/app_constants';
import { EmailService } from '../../../email/email.service';
import { PostStatus } from '../../../shared/models/poststatus.enum';
import { emailTemplate } from '../../../shared/email-template';
import { allBinEmailTemplate } from '../../../shared/all-bni-email-template';
import { droEmailTemplate } from '../../../shared/dro-email-template';
import { la2050 } from '../../../shared/la2050-template';
import { newla2050 } from '../../../shared/new-la2050-template';
import { thepaistTemplate } from '../../../shared/therapist-template';
import { newBniTemplate } from '../../../shared/new-bni-template';
import { womenbizTemplate } from '../../../shared/womenbiz-template';
import { linkedinTemplate } from '../../../shared/linkedin-template';
import { cocSmTemplate } from '../../../shared/cocsam-template';
import { cityTemplate } from '../../../shared/city-template';
import { dentistTemplate } from '../../../shared/dentis-template';
import { accountantTemplate } from '../../../shared/accountant-template';
import { realestateTemplate } from '../../../shared/realestate-template';
import { instagramTemplate } from '../../../shared/instagram-template';
import { Post } from '../../../shared/models/post.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('lr', { static: false }) lr: MatAnchor;
  @ViewChild('drawer', { static: false }) drawer: MatDrawer;
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
    public location: Location,
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
            // this.ref.detectChanges();
          } else {
            this.loggedInUser = u;
          }

        })
    );

    this.cartListLength = this.store.select(selectCartListLength);

  }

  ngAfterViewInit() {
    this.subscription.add(
      this.authService.openAuthenticationPopover.subscribe(open => {
        if (open) {
          this.lr._elementRef.nativeElement.click();
        }
      })
    );
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
    // this.postService.getAllPosts(
    //   {
    //     pageNumber: 1, limit: 10,
    //     sort: { order: '' }
    //   }, '', '', '',
    //   user._id
    // ).subscribe((u) => {
    //   this.listOfConnectedPosts.posts = u.posts;
    //   this.totalConnectedPosts = u.total;
    // });

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

  // sendEmails() {
  //   let count = 0;
  //   finalInstaEmails.forEach((e, i) => {
  //     setTimeout(() => {
  //       e.email.forEach((email, j) => {
  //         setTimeout(() => {
  //           if (!Validators.email(new FormControl(email.email))) {
  //             const emailObj = {
  //               to: [email.email],
  //               subject: `${e.instaProfileId} Monetize Your ${e.followers} Instagram Followers`, // Therapist
  //               companies: [{ _id: '5db1c84ec10c45224c4b95fd' }],
  //               type: PostType.Email,
  //               status: PostStatus.Published,
  //               // descriptionHTML: dentistTemplate.replace('{companyName}', e.companyName),
  //               // descriptionHTML: accountantTemplate.replace('{companyName}', e.companyName),
  //               descriptionHTML: instagramTemplate.replace('{instaProfileId}', e.instaProfileId).replace('{followers}', e.followers),
  //               createdBy: '5d4c1cdf91e63a3fe84bb43a',
  //               campaignId: '5ec800f9870915348a37f30f', // instagram
  //               // city: e.cityName
  //             };
  //             this.emailService.sendEmail(emailObj).toPromise().then((o) => {
  //               console.log(o, i);
  //               if (o) {
  //                 count += 1;
  //                 // dummyEmails[i]['sent'] = true;
  //               }
  //             }).catch((e) => {
  //               console.log(e);
  //             });
  //             // this.postService.sendEmailWithStaticContent(email, e.name, e.companyName, e.image).toPromise().then((o) => {
  //             //   console.log(o, i);
  //             //   if (o) {
  //             //     count += 1;
  //             //     // dummyEmails[i]['sent'] = true;
  //             //   }
  //             // }).catch((e) => {
  //             //   console.log(e);
  //             // });
  //           }
  //         }, j * 1500);
  //       });
  //       console.log(count);
  //     }, i * 1000);
  //   });
  // }

  toggleNavbar() {
    this.drawer.toggle();
  }
}