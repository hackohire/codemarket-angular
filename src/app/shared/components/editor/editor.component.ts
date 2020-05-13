import { Component, OnInit, EventEmitter, Output, Input, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
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
export class EditorComponent implements OnInit, OnDestroy {

  isHandset: boolean;

  @Input() post: Post; /** post for view mode */

  cloudServices = {
    tokenUrl: environment.ckEditor.developmentTokenUrl,
    webSocketUrl: environment.ckEditor.ws,
    uploadUrl: 'https://71258.cke-cs.com/easyimage/upload/'
  };

  @Input() realTime = false;

  collaboration = {
    channelId: this.post ? this.post._id : ''
  };

  public get editorConfig() {
    return {
      cloudServices: this.cloudServices,
      collaboration: this.collaboration,
      sidebar: {
        container: this.sidebar,
      },
      presenceList: {
        container: this.presenceList,
      },
      extraPlugins: [ this.myCustomUploadAdapterPlugin ]
    };
  }

  // Note that Angular refs can be used once the view is initialized so we need to create
  // these containers and use in the above editor configuration to workaround this problem.
  private sidebar = null;
  private presenceList = null;


  public model = {
    editorData: ''
  };

  public ckEditor = null;

  // fileExtensions = AttachesTool.EXTENSIONS;

  editor: any;
  of = of;
  selectedBlockIndex: number;
  isPlatformBrowser = false;
  @Input() companyPostId: string;
  @Input() userReferenceId: string;
  @Input() id: string;
  @Input() readOnly = false; /** read only mode */
  @Input()
  set html(h) {
    this.model.editorData = h;
  }
  get html() {
    return this.model.editorData;
  }

  _data: any[];
  @Input() data: any[];

  @Input() placeholder: string;
  @Input() commentType: string;
  @Output() output: EventEmitter<any> = new EventEmitter(); /** Emitting data with user interactions */
  @Input() importArticleSubscription = false;
  // @ViewChild('editorRef', { static: false }) editorRef: ElementRef;
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
  }

  ngOnInit() {
    if (this.post) {
      this.initializeCommentForm(this.post);
    }

    this.sidebar = this.isPlatformBrowser ? document.createElement('div') : null;
    this.presenceList = this.isPlatformBrowser ? document.createElement('div') : null;

    this.subscriptions$.add(
      this.breakpointObserver.observe(Breakpoints.Handset)
        .pipe(
          map(result => result.matches),
          tap(result => this.isHandset = result),
          share()
        ).subscribe()
    );
  }

  myCustomUploadAdapterPlugin(editor) {
    console.log(editor.plugins.get('EasyImage'));
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      // Configure the URL to the upload script in your back-end here!
      return new CustomUploadAdapter(loader);
    };
  }

  ngOnDestroy() {
    this.subscriptions$.unsubscribe();
  }

  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );

    if (this.realTime) {

    } else {

    }

    // editor.plugins.extraPlugins = [ this.myCustomUploadAdapterPlugin ];
  }

  initializeCommentForm(p) {
    this.commentForm = new FormGroup({
      text: new FormControl([]),
      referenceId: new FormControl(p._id),
      type: new FormControl(this.commentType ? this.commentType : p.type),
      blockSpecificComment: new FormControl(true),
      blockId: new FormControl(''),
    });
    if (this.companyPostId) {
      this.commentForm.addControl('companyReferenceId', new FormControl(this.companyPostId));
    }
    if (this.userReferenceId) {
      this.commentForm.addControl('userReferenceId', new FormControl(this.userReferenceId));
    }
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

  gistFrame(url: string) {
    const template = `<html><body><style type="text/css">.gist {overflow:auto;} .gist .gist-file .gist-data { max-height: 86vh; }</style><script src="gistSrc"></script></body></html>`;
    const replaced = template.replace('gistSrc', url + '.js');
    return replaced;
  }

  generateToken() {
    return new Promise((resolve, reject) => {
      const payload = {
        aud: environment.ckEditor.ckEditorEnvironMentId,
        sub: this.authService.loggedInUser._id,
        user: {
          email: this.authService.loggedInUser,
          name: this.authService.loggedInUser.name,
          avatar: this.authService.loggedInUser.avatar ? (this.s3FilesBucketURL + this.authService.loggedInUser.avatar) : this.anonymousAvatar
        },
        auth: {
          collaboration: {
            '*': {
              role: 'writer'
            }
          }
        }
      };
      // const result = jwt.sign( payload, environment.ckEditor.ckEditorSecretKey, { algorithm: 'HS256' } );
      // return resolve( result );
    });
  }

}
