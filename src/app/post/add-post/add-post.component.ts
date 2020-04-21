import { Component, OnInit, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { AddPost, UpdatePost } from '../../core/store/actions/post.actions';
import { AppState } from '../../core/store/state/app.state';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { PostStatus } from '../../shared/models/poststatus.enum';
import { EditorComponent } from '../../shared/components/editor/editor.component';
import { Post } from '../../shared/models/post.model';
import { Location } from '@angular/common';
import { PostService } from '../../shared/services/post.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss']
})
export class AddPostComponent implements OnInit {

  breadcumb: BreadCumb;
  postForm: FormGroup;

  editPostDetails: Post;

  /** When a user tries to tie a post with this post */
  postFromRoute: Post;

  @Input() postType = '';
  @Input() postId: string;

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

  subscription$ = new Subscription();


  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private location: Location,
    private changeDetector: ChangeDetectorRef
  ) {

    this.postType = this.activatedRoute.snapshot.queryParams['type'];
    this.postId = this.activatedRoute.snapshot.params['postId'];

    /** Make the Changes here while creating new post type */
    this.breadcumb = {
      title: `Add ${this.postType}`,
      path: [
        {
          name: this.postType
        }
      ]
    };

    this.postFormInitialization(null);
  }

  ngOnInit() {
    if (this.postId) {
      this.subscription$.add(
        this.postService.getPostById(this.postId).subscribe((p) => {
          this.editPostDetails = p;
          this.postType = p.type;
          this.breadcumb.title = this.postType;
          this.breadcumb.path[0].name = this.postType;
          this.postFormInitialization(p);
        })
      );
    }
  }

  postFormInitialization(i: Post) {
    this.postForm = new FormGroup({
      name: new FormControl(i && i.name ? i.name : '', Validators.required),
      description: new FormControl(i && i.description ? i.description : []),
      tags: new FormControl(i && i.tags ? i.tags : []),
      companies: new FormControl(i && i.companies ? i.companies : []),
      assignees: new FormControl(i && i.assignees ? i.assignees : []),
      clients: new FormControl(i && i.clients ? i.clients : []),
      collaborators: new FormControl(i && i.collaborators ? i.collaborators : []),
      createdBy: new FormControl(i && i.createdBy && i.createdBy._id ? i.createdBy._id : ''),
      status: new FormControl(i && i.status ? i.status : PostStatus.Drafted),
      type: new FormControl(i && i.type ? i.type : this.postType),
      descriptionHTML: new FormControl(i && i.descriptionHTML ? i.descriptionHTML : '')
    });

    if (this.postId || (i && i._id)) {
      this.postForm.addControl('_id', new FormControl(i && i._id ? i._id : ''));
    }


    /** If somebody tries to tie a post with this post */
    this.postFromRoute = this.location.getState()['post'];

    if (this.postFromRoute) {
      this.postForm.get('tags').setValue(this.postFromRoute.tags);
      this.postForm.get('assignees').setValue(this.postFromRoute.assignees);
      this.postForm.get('collaborators').setValue(this.postFromRoute.collaborators);
      this.postForm.get('companies').setValue(this.postFromRoute.companies);

      this.postForm.addControl('connectedPosts', new FormControl([this.postFromRoute._id]));
    }
  }


  async submit(status, descriptionEditor?: EditorComponent) {

    if (!this.authService.loggedInUser) {
      this.authService.checkIfUserIsLoggedIn(true);
      return;
    }

    const blocks =  await this.descriptionEditor.editor.save();
    this.descriptionFormControl.setValue(blocks.blocks);

    if (this.authService.loggedInUser && !this.createdBy.value) {
      this.createdBy.setValue(this.authService.loggedInUser._id);
    }

    this.changeDetector.detectChanges();

    const postFormValue = {...this.postForm.value};
    postFormValue['status'] = status;
    postFormValue['descriptionHTML'] = descriptionEditor.editorViewRef.nativeElement.innerHTML;
    // postFormValue.companies = postFormValue.companies.map(c => c._id);

    if (this.postId) {
      this.store.dispatch(UpdatePost({
        post: postFormValue, updatedBy: {name: this.authService.loggedInUser.name, _id: this.authService.loggedInUser._id},
      }));
    } else {
      this.store.dispatch(AddPost({post: postFormValue}));
    }
  }

  cancelClicked() {
    this.location.back();
  }

}
