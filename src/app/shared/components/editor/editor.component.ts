import { Component, OnInit, EventEmitter, Output, Input, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { appConstants } from '../../constants/app_constants';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CommentService } from '../../services/comment.service';
import { Post } from '../../models/post.model';
import { Comment } from '../../models/comment.model';
import { isPlatformBrowser } from '@angular/common';
const path = require('path');
import { PostService } from '../../services/post.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { of } from 'rxjs';
import { map, share, tap } from 'rxjs/operators';
import { CustomUploadAdapter } from './FileUploader';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  // encapsulation: ViewEncapsulation.ShadowDom
})
export class EditorComponent implements OnInit, OnDestroy, AfterViewInit {

  isHandset: boolean;

  @Input() post: Post; /** post for view mode */

  editor: any

  ckEditorUserToken: string;
  webSocketUrl = environment.ckEditor.ws;
  uploadUrl: 'https://71258.cke-cs.com/easyimage/upload/';

  @Input() realTime = false;
  @Input() role = 'commentator';

  // Note that Angular refs can be used once the view is initialized so we need to create
  // these containers and use in the above editor configuration to workaround this problem.
  public sidebar = null;
  public presenceList = null;

  public model = {
    editorData: ''
  };

  public ckEditor = null;

  selectedBlockIndex: number;
  isPlatformBrowser = false;

  @Input() companyPostId: string;
  @Input() userReferenceId: string;
  @Input() id: string;

  /** read only mode */
  __readOnly = false;
  @Input()
  set readOnly(h) {
    this.__readOnly = h;
    /** If editting mode for comments set the toolbar */
    if (!h && this.ckEditorRef && this.ckEditorRef.editorInstance) {
      this.setToolbar(this.ckEditorRef.editorInstance);
    }
  }
  get readOnly() {
    return this.__readOnly;
  }


  @Input()
  set html(h) {
    this.model.editorData = h;
  }
  get html() {
    return this.model.editorData;
  }

  of = of;

  _data: any[];
  @Input() data: any[];

  @Input() placeholder: string;
  @Input() commentType: string;
  @Output() output: EventEmitter<any> = new EventEmitter(); /** Emitting data with user interactions */
  @Input() importArticleSubscription = false;

  @ViewChild('editorRef', { static: false }) editorRef: ElementRef;
  @ViewChild('ckEditorRef', { static: false }) ckEditorRef;
  @ViewChild('editorViewRef', { static: true }) editorViewRef: ElementRef;

  @ViewChild('sidebar', { static: true }) private sidebarContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('presenceList', { static: true }) private presenceListContainer?: ElementRef<HTMLDivElement>;
  @Output() showComments: EventEmitter<{ block: any }> = new EventEmitter();

  subscriptions$ = new Subscription();

  @Input() editorStyle = {
    // background: '#eff1f570',
    // 'word-break': 'break-word',
    // padding: '15px',
    // border: 'dotted #ececec'
  };

  /** Variables related to block level comments */
  @Input() blockLevelComments = false;
  @Input() commentsList: Comment[];
  anonymousAvatar = '../../../../assets/images/anonymous-avatar.jpg';
  s3FilesBucketURL = environment.s3FilesBucketURL;

  commentForm: FormGroup;

  extensions = new Set(appConstants.imageExtenstions);

  constructor(
    public authService: AuthService,
    public commentService: CommentService,
    @Inject(PLATFORM_ID) public _platformId: Object,
    private postService: PostService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.isPlatformBrowser = isPlatformBrowser(this._platformId);

    if (this.isPlatformBrowser) {
      const DocumentEditor = require('src/assets/js/ckeditor');
      this.ckEditor = DocumentEditor;
    }

    /** Side bar for comments & presenceList for online users */
    this.sidebar = this.isPlatformBrowser && this.realTime ? document.createElement('div') : null;
    this.presenceList = this.isPlatformBrowser && this.realTime ? document.createElement('div') : null;
  }

  ngOnInit() {
    if (this.post) {
      this.initializeCommentForm(this.post);
    }

    this.subscriptions$.add(
      this.breakpointObserver.observe(Breakpoints.Handset)
        .pipe(
          map(result => result.matches),
          tap(result => this.isHandset = result),
          share()
        ).subscribe()
    );

    this.subscriptions$.add(
      this.authService.loggedInUser$.subscribe(async (u) => {
        if (u && !this.ckEditorUserToken && this.realTime) {
          this.authService.generateCkEditorToken({ name: u.name, _id: u._id, email: u.email, avatar: this.s3FilesBucketURL + u.avatar }, this.role).toPromise().then(t => {
            this.ckEditorUserToken = t;
            // this.ckEditor.update();
          });
        }
      })
    );
  }

  public ngAfterViewInit() {
    if (!this.sidebarContainer || !this.presenceListContainer) {
      // throw new Error('Div containers for sidebar or presence list were not found');
    }

    if (this.realTime) {
      if (this.sidebarContainer && this.sidebarContainer.nativeElement) {
        this.sidebarContainer.nativeElement.appendChild(this.sidebar);
      }
      if (this.presenceListContainer && this.presenceListContainer.nativeElement) {
        this.presenceListContainer.nativeElement.appendChild(this.presenceList);
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions$.unsubscribe();
  }

  /** When the editor is ready */
  public onReady(editor) {
    this.setToolbar(editor);
  }

  setToolbar(editor) {
    /** Show the toolbar */
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  myCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      // Configure the URL to the upload script in your back-end here!
      return new CustomUploadAdapter(loader);
    };
  }

  initializeCommentForm(p) {
    this.commentForm = new FormGroup({
      text: new FormControl([]),
      referenceId: new FormControl(p._id),
      type: new FormControl(this.commentType ? this.commentType : p.type),
      blockSpecificComment: new FormControl(true),
      blockId: new FormControl(''),
    });
  }

  async addComment(blockId: string, addCommentEditor: EditorComponent) {
    console.log(this.commentForm.value);
    if (this.authService.loggedInUser) {
      const blocks = await addCommentEditor.editor.save();
      this.commentForm.get('text').setValue(blocks.blocks);
      this.commentForm.addControl('createdBy', new FormControl(this.authService.loggedInUser._id));
      this.commentForm.get('blockId').setValue(blockId),
        this.subscriptions$.add(
          this.commentService.addComment(this.commentForm.value).subscribe((c) => {
            if (c) {
              addCommentEditor.editor.blocks.clear();
            }
          })
        );
    } else {
      this.authService.checkIfUserIsLoggedIn(true);
    }
  }

  /** Check if media is image */
  isImage(filePath: string) {
    return filePath && this.extensions.has(path.extname(filePath).slice(1).toLowerCase());
  }

  /** Return Number of comments for that block */
  numberOfComments(blockId) {
    return this.commentsList.filter(c => c.blockId === blockId).length;
  }

  /** Listen to the output event from the comment component and delete the comment */
  // deleteComment(id: string) {
  //   // this.commentsList = this.commentsList.filter(c => c._id !== id);
  // }

  generateToken = () => {
    return new Promise((res, rej) => {
      return res(this.ckEditorUserToken);
    });
  }

  autosave = (editor) => {
    return this.postService.updatePostContent({descriptionHTML: editor.getData(), _id: this.post._id}).toPromise();
  }

}
