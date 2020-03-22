import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { AppState } from '../../core/store/state/app.state';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, of } from 'rxjs';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EditorComponent } from '../../shared/components/editor/editor.component';
import { CompanyPostTypes, PostType } from '../../shared/models/post-types.enum';
import { SetSelectedPost, GetPostById, AddPost, UpdatePost } from '../../core/store/actions/post.actions';
import { selectSelectedPost } from '../../core/store/selectors/post.selectors';
import { tap, switchMap } from 'rxjs/operators';
import { Post } from '../../shared/models/post.model';
import { PostStatus } from '../../shared/models/poststatus.enum';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.scss']
})

export class AddAssignmentComponent implements OnInit {

  @Input() connectedEvent: string;

  breadcumb: BreadCumb;
  postForm: FormGroup;

  get createdBy() {
    return this.postForm.get('createdBy');
  }

  get idFromControl() {
    return this.postForm.get('_id');
  }

  get descriptionFormControl() {
    return this.postForm.get('description');
  }

  get statusFormControl() {
    return this.postForm.get('status');
  }

  @ViewChild('descriptionEditor', { static: false }) descriptionEditor: EditorComponent;

  subscription$: Subscription;


  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
  ) {

    /** Make the Changes here while creating new post type */
    this.breadcumb = {
      title: 'Add Assignment Details',
      path: [

        {
          name: PostType.Assignment
        }
      ]
    };
  }

  ngOnInit() {
        /** Make the Changes here while creating new post type */
        if (this.activatedRoute.snapshot.parent.routeConfig.path === `add-${PostType.Assignment}` || this.connectedEvent) {
          this.store.dispatch(SetSelectedPost({ post: null }));
          this.postFormInitialization(null);
        } else {
          this.subscription$ = this.store.select(selectSelectedPost).pipe(
            tap((h: any) => {
              this.postFormInitialization(h);
            }),
            switchMap((h) => {
              if (!h) {
                return this.activatedRoute.params;
              }
              return of({});
            }),
            tap((params) => {
              /** When user refresh the tab, there won't be any selected goal, so we need to make the call to
               * get the goal by fetching id from the params
               */
              if (params && params.postId) {
                this.store.dispatch(GetPostById({ postId: params.postId }));
              }
            })
          ).subscribe();
        }
  }

  postFormInitialization(i: Post) {
    this.postForm = new FormGroup({
      name: new FormControl(i && i.name ? i.name : '', Validators.required),
      description: new FormControl(i && i.description ? i.description : []),
      createdBy: new FormControl(i && i.createdBy && i.createdBy._id ? i.createdBy._id : ''),
      status: new FormControl(i && i.status ? i.status : PostStatus.Drafted),
      _id: new FormControl(i && i._id ? i._id : ''),
      // change this line
      type: new FormControl(PostType.Assignment),
    });

    /** If @connectedEventId from input paramter */
    if (this.connectedEvent) {
      this.postForm.addControl('connectedEvent', new FormControl(this.connectedEvent));
    }
  }


  async submit(status) {

    if (!this.authService.loggedInUser) {
      this.authService.checkIfUserIsLoggedIn(true);
      return;
    }

    this.statusFormControl.setValue(status);

    const blocks = await this.descriptionEditor.editor.save();
    this.descriptionFormControl.setValue(blocks.blocks);

    if (this.authService.loggedInUser && !this.createdBy.value) {
      this.createdBy.setValue(this.authService.loggedInUser._id);
    }

    if (this.idFromControl && !this.idFromControl.value) {
      this.postForm.removeControl('_id');
      this.store.dispatch(AddPost({ post: this.postForm.value }));
    } else {
      this.store.dispatch(UpdatePost({ post: this.postForm.value }));
    }
  }

}
