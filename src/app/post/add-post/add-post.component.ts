import { Component, OnInit, ViewChild, Input, ChangeDetectorRef, AfterViewInit } from '@angular/core';
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
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss'],
})
export class AddPostComponent implements OnInit, AfterViewInit {

  s3Bucket = environment.s3FilesBucketURL;

  breadcumb: BreadCumb;
  postForm: FormGroup;

  editPostDetails: Post;
  postTitle;

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
    public authService: AuthService,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private location: Location,
    private changeDetector: ChangeDetectorRef
  ) {

    this.postType = this.activatedRoute.snapshot.queryParams.type;
    this.postId = this.activatedRoute.snapshot.params.postId;

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

  ngAfterViewInit(): void {
    if (this.descriptionEditor && this.descriptionEditor.ckEditorRef) {
      console.log(this.descriptionEditor.ckEditorRef.elementRef.nativeElement);
      this.descriptionEditor.ckEditorRef.editorElement.style.minHeight = '73vh';
    }
  }

  ngOnInit() {
    if (this.postId) {
      this.subscription$.add(
        this.postService.getPostById(this.postId).subscribe((p) => {
          this.editPostDetails = p;
          this.postTitle = p.name;
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
      descriptionHTML: new FormControl(i && i.descriptionHTML ? i.descriptionHTML : ''),
      tags: new FormControl(i && i.tags ? i.tags : []),
      companies: new FormControl(i && i.companies ? i.companies : []),
      assignees: new FormControl(i && i.assignees ? i.assignees : []),
      clients: new FormControl(i && i.clients ? i.clients : []),
      collaborators: new FormControl(i && i.collaborators ? i.collaborators : []),
      createdBy: new FormControl(i && i.createdBy && i.createdBy._id ? i.createdBy._id : ''),
      status: new FormControl(i && i.status ? i.status : PostStatus.Drafted),
      type: new FormControl(i && i.type ? i.type : this.postType),
    });

    if (this.postId || (i && i._id)) {
      this.postForm.addControl('_id', new FormControl(i && i._id ? i._id : ''));
    }


    /** If somebody tries to tie a post with this post */
    this.postFromRoute = (this.location.getState() as any).post;

    if (this.postFromRoute) {
      this.postForm.get('tags').setValue(this.postFromRoute.tags);
      this.postForm.get('assignees').setValue(this.postFromRoute.assignees);
      this.postForm.get('collaborators').setValue(this.postFromRoute.collaborators);
      this.postForm.get('companies').setValue(this.postFromRoute.companies);

      this.postForm.addControl('connectedPosts', new FormControl([this.postFromRoute._id]));
    }

    if (i && !i.descriptionHTML && i.description.length) {
      // this.postForm.get('descriptionHTML').setValue(this.descriptionEditor.editorUI);
    }
  }


  async submit(status, descriptionEditor?: EditorComponent) {

    if (!this.authService.loggedInUser) {
      this.authService.checkIfUserIsLoggedIn(true);
      return;
    }

    // const blocks = await this.descriptionEditor.editor.save();
    // this.descriptionFormControl.setValue(blocks.blocks);
    this.postForm.get('descriptionHTML').setValue(this.descriptionEditor.html);

    if (this.authService.loggedInUser && !this.createdBy.value) {
      this.createdBy.setValue(this.authService.loggedInUser._id);
    }

    const postFormValue = { ...this.postForm.value };
    postFormValue.status = status;
    // postFormValue.companies = postFormValue.companies.map(c => c._id);

    if (this.postId) {
      this.store.dispatch(UpdatePost({
        post: postFormValue, updatedBy: {name: this.authService.loggedInUser.name, _id: this.authService.loggedInUser._id},
      }));
    } else {
      this.store.dispatch(AddPost({ post: postFormValue }));
    }
  }

  cancelClicked() {
    this.location.back();
  }

  uploadImage(a, b, c) {
    console.log(a, b, c);
  }

  recieveEvent(event) {
    this.postForm.controls.tags.setValue(event.tags);
    this.postForm.controls.companies.setValue(event.companies);
    this.postForm.controls.clients.setValue(event.clients);
    this.postForm.controls.collaborators.setValue(event.collaborators);
    this.postForm.controls.name.setValue(event.name);
  }

}
