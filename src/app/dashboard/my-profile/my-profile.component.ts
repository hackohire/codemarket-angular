import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../user/user.service';
import { User } from '../../shared/models/user.model';
import { Observable, Subscription, of } from 'rxjs';
import { VideoChatComponent } from '../../video-chat/video-chat.component';
import { MatDialog, MatAutocomplete, MatChipInputEvent } from '@angular/material';
import Peer from 'peerjs';
import { PostType } from '../../shared/models/post-types.enum';
import { Tag } from '../../shared/models/product.model';
import { FormService } from '../../shared/services/form.service';
import { FormControl, FormArray } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { startWith, map, switchMap, tap } from 'rxjs/operators';
import { PostService } from '../../shared/services/post.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  breadcumb: BreadCumb;
  navLinks = [];
  anonymousAvatar = '../../../assets/images/anonymous-avatar.jpg';
  s3FilesBucketURL = environment.s3FilesBucketURL;
  authorId: string;

  userData$: Observable<User>;
  porfileData: any;

  peer: Peer;

  subscription = new Subscription();

  @ViewChild('searchInput', { static: false }) searchInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  tagsFormControl: FormArray;
  searchText = new FormControl();
  tagSuggestions: Tag[];
  allTags: Tag[];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  selectBusinessAreaInterests: boolean;
  selectLeadershipAreaInterests: boolean;
  selectsocialImpactInterests: boolean;
  // get tagsFormControl() {
  //   return this.eventForm.get('tags') as FormArray;
  // }

  constructor(
    public authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router,
    private formService: FormService,
    public postService: PostService
  ) {

    this.breadcumb = {
      title: 'Profile',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'My Profile'
        }
      ]
    };

    /** Peer Subscription for Video Call */
    this.subscription.add(
      this.userService.peer.subscribe((p) => {
        if (p) {
          console.log(p);
          this.peer = p;
        }
      })
    );
  }

  ngOnInit() {
    this.authorId = this.activatedRoute.snapshot.params.authorId;

    // If user is visitng somebody else's profile
    if (this.authorId) {
      this.userData$ = this.userService.getUserById(this.authorId);

      this.subscription.add(
        this.userService.getMyProfileInfo(this.authorId).subscribe(d => {
          this.porfileData = d;
        })
      )
    } else {
      this.userData$ = this.authService.loggedInUser$;

      this.subscription.add(
        this.authService.loggedInUser$.pipe(
          switchMap((u) => u ? this.userService.getMyProfileInfo(u._id) : of(null)),
          tap((d) => {
            if (d) {
              this.porfileData = d;
            }
          })
        ).subscribe()
      )
    }
    this.createTabs();

    // this.userService.peer.subscribe((p) => {
    //   if (p) {
    //     console.log(p);
    //     this.peer = p;
    //   }
    // });
  }

  createTabs() {
    // this.navLinks = [ ];

    // If user is visiting somebody else's profile don't show what other user has bought
    if (!this.authorId) {
      this.navLinks.push(
        {
          path: 'purchased-items-list',
          label: 'Buy'
        },
        {
          path: 'products-list',
          label: 'Sell'
        },
        {
          path: 'membership-list',
          label: 'Membership'
        },
        {
          path: 'my-rsvp',
          label: 'My RSVP'
        }
      );
      this.router.navigate(['purchased-items-list'], { relativeTo: this.activatedRoute });
    } else {
      this.navLinks.push(
        {
          path: 'products-list',
          label: 'Sell'
        },
        {
          path: 'post-list',
          label: 'Request Help',
          queryParams: { type: PostType.HelpRequest, all: false }
        },
      );
      this.router.navigate(['products-list'], { relativeTo: this.activatedRoute });
    }

    this.navLinks.push(
      {
        path: 'business-coaches',
        label: 'Business Coach'
      },
      {
        path: 'career-coaches',
        label: 'Career Coach'
      }
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(VideoChatComponent, {
      width: '550px',
      data: { authorId: this.authorId, peer: this.peer },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  addTagAction(tags) {

    const tagsControlArray = []
    if (tags && tags.length) {
      tags.forEach(t => {
        tagsControlArray.push(new FormControl(t));
      })
    }
    this.tagsFormControl = new FormArray(tagsControlArray);
    this.formService.findFromCollection('', 'tags').subscribe((tags) => {
      this.tagSuggestions = tags;
      this.allTags = tags;
    });

    this.searchText.valueChanges.pipe(
      startWith(''),
      map((text) => text ? this._filter(text) : this.allTags && this.allTags.length ? this.allTags.slice() : []))
      .subscribe((tags) => this.tagSuggestions = tags);
  }

  updateInterests(interest: string, flagName: string) {
    this.userService.updateUser({
      _id: this.authorId ? this.authorId : this.authService.loggedInUser._id,
      [interest]: this.tagsFormControl.value
    }).subscribe(u => {
      if (u) {
        this.porfileData[interest] = u[interest];
        this[flagName] = false;
        this.tagsFormControl = null;
      }
    })
  }

  private _filter(value): Tag[] {
    const filterValue = value && value.name ? value.name.toLowerCase() : value.toLowerCase();
    return this.allTags.filter(tag => tag.name.toLowerCase().indexOf(filterValue) === 0);
  }

  addTech(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const availableTag = this.tagSuggestions.find((t) => t.name.toLowerCase() == event.value.trim().toLowerCase());
      const formAvailableInTafsFormControl = this.tagsFormControl.value.find((t) => t.name.toLowerCase() == event.value.trim().toLowerCase());
      if (formAvailableInTafsFormControl && event && event.input && event.input.value) {
        event.input.value = '';
      } else if (availableTag) {
        this.tagsFormControl.push(new FormControl({ name: availableTag.name, _id: availableTag._id }));
      } else {
        this.formService.addCategory(this.tagsFormControl, event);
      }
      // this.tagSuggestions = this.tagSuggestions.filter((t) => t.name.toLowerCase() !== event.value.trim().toLowerCase())
      this.searchText.setValue(null);
    }
  }

  selected(event) {
    // this.tagSuggestions = this.tagSuggestions.filter((t) => t._id !== event.option.value._id)
    const formAvailableInTafsFormControl = this.tagsFormControl.value.find((t) => t.name.toLowerCase() == event.option.value.name.trim().toLowerCase());
    if (formAvailableInTafsFormControl) {
      event.input.value = '';
    } else {
      this.formService.selectedCategory(this.tagsFormControl, event);
    }
    this.searchInput.nativeElement.value = null;
    this.searchText.setValue(null);
  }


  // Remove a Tag
  public remove(index: number): void {
    this.formService.removeCategory(this.tagsFormControl, index);
  }

}
