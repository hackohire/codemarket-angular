import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/state/app.state';
import { AuthService } from 'src/app/core/services/auth.service';
import { selectCartListLength } from '../../store/selectors/cart.selectors';
import { Router } from '@angular/router';
import { MatDialog, MatAnchor } from '@angular/material';
import { SearchComponent } from '../search/search.component';
import { droEmails, emails, la2050Emails, therapistEmails } from '../../../emails';
import { newBniEmails, womenBizEmails, cityEmails, cocSmEmail, linkedInEmails } from '../../../newEmails';
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
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit, OnDestroy {

  @ViewChild('lr', { static: false }) lr: MatAnchor;
  postTypes = PostType;

  postTypesArray = appConstants.postTypesArray;

  signUpConfig = {
    // header: 'My Customized Sign Up',
    hideAllDefaults: true,
    signUpFields: [
      {
        label: 'Name',
        key: 'name',
        required: true,
        displayOrder: 1,
        type: 'string'
      },
      {
        label: 'Email',
        key: 'email',
        required: true,
        displayOrder: 2,
        type: 'string',
      },
      {
        label: 'Password',
        key: 'password',
        required: true,
        displayOrder: 3,
        type: 'password'
      },
    ]
  };
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
    private postService: PostService,
    public messageService: MessageService,
    private emailService: EmailService
  ) {
  }

  /** Load the Login/ Register popover on the page automatically if user is not loggedin */
  async ngAfterViewInit() {

    this.subscription.add(
      this.authService.openAuthenticationPopover.subscribe(open => {
        if (open) {
          this.lr._elementRef.nativeElement.click();
        }
      })
    );

    // if (await this.authService.checkIfUserIsLoggedIn()) {

    // } else {
    //   setTimeout(() => {
    //     this.lr._elementRef.nativeElement.click();
    //   }, 2000);
    // }
  }

  ngOnInit() {
    this.subscription.add(
      this.authService.loggedInUser$.subscribe(u => {
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

  sendEmails() {
    let count = 0;
    cityEmails.forEach((e, i) => {
      setTimeout(() => {
        e.email.forEach((email, j) => {
          setTimeout(() => {
            if (!Validators.email(new FormControl(email.email))) {
              const emailObj = {
                to: [email.email],
                // subject: `${e.companyName}, Online Sales`, // cocsm 
                subject: `${e.cityName}, Tech Boost Invitation`, //&& city
                companies: [{ _id: '5db1c84ec10c45224c4b95fd' }],
                type: PostType.Email,
                status: PostStatus.Published,
                // descriptionHTML: cocSmTemplate.replace('{companyName}', e.companyName),
                descriptionHTML: cityTemplate.replace('{cityName}', e.cityName).replace('{cityName}', e.cityName),
                createdBy: '5d4c1cdf91e63a3fe84bb43a',
                campaignId: '5ec3e8d0a1587b4ade4b1015', // city
                //  campaignId: '5ec3db9ea1587b4ade4b1014' // cocsm
                city: e.cityName
              };
              this.emailService.sendEmail(emailObj).toPromise().then((o) => {
                console.log(o, i);
                if (o) {
                  count += 1;
                  // dummyEmails[i]['sent'] = true;
                }
              }).catch((e) => {
                console.log(e);
              });
              // this.postService.sendEmailWithStaticContent(email, e.name, e.companyName, e.image).toPromise().then((o) => {
              //   console.log(o, i);
              //   if (o) {
              //     count += 1;
              //     // dummyEmails[i]['sent'] = true;
              //   }
              // }).catch((e) => {
              //   console.log(e);
              // });
            }
          }, j * 1500);
        });
        console.log(count);
      }, i * 1000);
    });
  }
}
