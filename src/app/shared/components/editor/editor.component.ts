import { Component, OnInit, EventEmitter, Output, Input, OnDestroy, OnChanges, AfterViewInit, SimpleChanges, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
// import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';
import List from '@editorjs/list';
import Marker from '@editorjs/marker';
// import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import Delimiter from '@editorjs/delimiter';
// import Embed from '@editorjs/embed';
import Embed from '../../../editor-js/plugins/embed';
import Paragraph from '../../../editor-js/plugins/paragraph/bundle';
import LinkTool from '@editorjs/link';
import { AttachesTool } from '../../../editor-js/plugins/attach-files/attach';
// import Warning from '@editorjs/warning';
import Storage from '@aws-amplify/storage';
import { environment } from 'src/environments/environment';
import { CodeWithLanguageSelection } from 'src/app/insert-code-snippet';
import { HighlightJS } from 'ngx-highlightjs';
import { appConstants } from '../../constants/app_constants';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CommentService } from '../../services/comment.service';
import { Post } from '../../models/post.model';
import { Comment } from '../../models/comment.model';
import { isPlatformBrowser } from '@angular/common';
const path = require('path');
import editorJS from '../../../editor-js/dist/editor';
import InlineCode from '@editorjs/inline-code';
import EditorJS, { EditorConfig } from '@editorjs/editorjs';
import { PostService } from '../../services/post.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { of } from 'rxjs';
import { map, share, tap } from 'rxjs/operators';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class EditorComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {

  isHandset: boolean;

  fileExtensions = AttachesTool.EXTENSIONS;

  editor: EditorJS;
  of = of;
  selectedBlockIndex: number;
  isPlatformBrowser = false;
  @Input() post: Post; /** post for view mode */
  @Input() companyPostId: string;
  @Input() userReferenceId: string;
  @Input() id: string;
  @Input() readOnly = false; /** read only mode */

  _data: any[];
  @Input()
  set data(updatedData) {
    this._data = updatedData;
    if (this.editor && Object.keys(this.editor).length !== 0) {
      if (updatedData && updatedData.length) {
        this.editor.render({ blocks: updatedData });
      } else {
        this.editor.blocks.clear();
      }
    }
  }
  get data() {
    return this._data;
  }
  @Input() placeholder: string;
  @Input() commentType: string;
  @Output() output: EventEmitter<any> = new EventEmitter(); /** Emitting data with user interactions */
  @Input() importArticleSubscription = false;
  @ViewChild('editorRef') editorRef: ElementRef;
  @ViewChild('editorViewRef', { static: true }) editorViewRef: ElementRef;

  @Output() showComments: EventEmitter<{ block: any }> = new EventEmitter();

  subscriptions$ = new Subscription();

  @Input() editorStyle = {
    background: '#eff1f570',
    'word-break': 'break-word',
    padding: '15px',
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
    private _hljs: HighlightJS,
    public authService: AuthService,
    public commentService: CommentService,
    @Inject(PLATFORM_ID) public _platformId: Object,
    private postService: PostService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.isPlatformBrowser = isPlatformBrowser(this._platformId);
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
  }

  ngAfterViewInit(): void {
    /** Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
     * Add 'implements AfterViewInit' to the class.
     */

    if (!this.readOnly) {
      this.initiateEditor();
    }

    /** Get all the code elements from DOM and highlight them as code snippets using highlight.js */
    if (this.editorViewRef && isPlatformBrowser(this._platformId) && this.editorViewRef.nativeElement) {
      this.editorViewRef.nativeElement.querySelectorAll('pre code').forEach((block: HTMLElement) => {
        this._hljs.highlightBlock(block);
      });
    }
    this.zoomInZoomOutForImages();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.editor && this.editor.blocks && changes.readOnly && !changes.readOnly.currentValue) {
      this.editor.destroy();
      this.readOnly = false;
      // this.initiateEditor();
      // this.editor.focus();
    } else if (this.editor && changes.readOnly && changes.readOnly.currentValue) {
      this.editor.destroy();
      // this.initiateEditor();
    } else if ((!this.editor || !this.editor.clear) && changes.readOnly && !changes.readOnly.currentValue) {
      this.readOnly = false;
      this.initiateEditor();
    }
  }

  ngOnDestroy() {
    if (this.editor && this.editor.clear) {
      this.editor.destroy();
    }
    this.subscriptions$.unsubscribe();
  }

  initializeCommentForm(p) {
    this.commentForm = new FormGroup({
      text: new FormControl(''),
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

  updateFormData(event) {
    this.commentForm.get('text').setValue(event);
  }

  initiateEditor(blocks = null) {
    // Text Editor With Plugin and Configuration

    console.log(this.id);
    if (isPlatformBrowser(this._platformId)) {
      if (this.importArticleSubscription) {
        this.subscriptions$.add(
          this.postService.contentFromAnotherArticle.subscribe(p => {
            if (p) {
              this.editor.blocks.renderFromHTML(p);
            }
          })
        );
      }

      this.editor = new editorJS({
        tools: {
          header: Header,
          /** Config Editor.js For Embedding Youtube Videos and Codepen and etc */
          embed: {
            class: Embed,
            inlineToolbar: true
          },
          delimiter: Delimiter,
          inlineCode: InlineCode,
          // delimiter: {
          //   class: Delimiter
          // },
          paragraph: {
            class: Paragraph
          },
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: environment.serverless_url + 'fetchLinkMeta', // Your backend endpoint for url data fetching
            }
          },
          // warning: {
          //   class: Warning,
          //   inlineToolbar: true,
          //   shortcut: 'CMD+SHIFT+W',
          //   config: {
          //     titlePlaceholder: 'Title',
          //     messagePlaceholder: 'Message',
          //   },
          // },
          table: {
            class: Table,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 2,
            },
          },
          Marker: {
            class: Marker,
            shortcut: 'CMD+SHIFT+M',
            inlineToolbar: true,
          },
          // quote: {
          //   class: Quote,
          //   inlineToolbar: true,
          //   shortcut: 'CMD+SHIFT+O',
          // },
          list: {
            class: List,
            inlineToolbar: true,
          },
          attaches: {
            class: AttachesTool,
            toolbox: {
              title: 'Attach Files'
            },
            config: {
              // injector: this.injector,
              endpoint: environment.s3FilesBucketURL,
              uploader: {
                /**
                 * Upload file to the server and return an uploaded image data
                 * @param { File } file - file selected from the device or pasted by drag-n-drop
                 * @return {Promise.<{success, file: {url}}>}
                 */
                uploadByFile: (file) => {
                  // your own uploading logic here

                  const fileNameSplitArray = file.name.split('.');
                  const fileExt = fileNameSplitArray.pop();
                  const fileName = fileNameSplitArray[0] + '-' + new Date().toISOString() + '.' + fileExt;

                  return Storage.vault.put(fileName, file, {

                    bucket: appConstants.fileS3Bucket,

                    level: 'public',

                    contentType: file.type,
                  }).then((uploaded: any) => {
                    console.log('uploaded', uploaded);
                    return {
                      success: 1,
                      createdBy: {_id: this.authService.loggedInUser._id },
                      file: {
                        url: environment.s3FilesBucketURL + uploaded.key,
                        name: fileName,
                        size: file.size
                        // any other image data you want to store, such as width, height, color, extension, etc
                      }
                    };
                  });
                },
              }
            }
          },
          image: {
            class: ImageTool,
            toolbox: {
              title: 'Media'
            },
            config: {
              buttonContent: 'Select A Media File(Image / GIF / Video)',
              uploader: {
                /**
                 * Upload file to the server and return an uploaded image data
                 * @param { File } file - file selected from the device or pasted by drag-n-drop
                 * @return {Promise.<{success, file: {url}}>}
                 */
                uploadByFile(file) {
                  // your own uploading logic here

                  const fileNameSplitArray = file.name.split('.');
                  const fileExt = fileNameSplitArray.pop();
                  const fileName = fileNameSplitArray[0] + '-' + new Date().toISOString() + '.' + fileExt;

                  return Storage.vault.put(fileName, file, {

                    bucket: appConstants.fileS3Bucket,

                    level: 'public',

                    contentType: file.type,
                  }).then((uploaded: any) => {
                    console.log('uploaded', uploaded);
                    return {
                      success: 1,
                      file: {
                        url: environment.s3FilesBucketURL + uploaded.key,
                        // any other image data you want to store, such as width, height, color, extension, etc
                      }
                    };
                  });
                },
                uploadByUrl(url) {
                  // console.log(url);
                  // console.log(decodeURI(url));
                  // url = decodeURI(url);
                  // url = url.replace(/"/gi, '')
                  // const a = url.slice(url.split('/', 3).join('/').length + 1, url.length)
                  return Promise.resolve({
                    success: 1,
                    file: {
                      url
                      // any other image data you want to store, such as width, height, color, extension, etc
                    }
                  });
                }
              }
            }
          },
          code: {
            class: CodeWithLanguageSelection,
            config: {
              readOnly: this.readOnly,
              isPlatformBrowser: isPlatformBrowser(this._platformId)
            }
          },
        },
        holder: this.id,
        data: {
          blocks: this.data && this.data.length ? this.data : blocks
        },
        placeholder: this.placeholder ? this.placeholder : 'Let`s write!',
        onReady: (() => {

          // this.editor.blocks.render({blocks: this.data});

          /** Focus at end */
          this.editor.focus(true);

          this.addControlsIfVideoElement();
          this.zoomInZoomOutForImages();

          // /** Open editor toolbar manually, which will load only "+" icon */
          // this.editor.toolbar.open();

          // /** Then we fetch the reference of "+" button and click it programatically */
          // setTimeout(() => {
          //   const a = this.editorRef.nativeElement.getElementsByClassName('ce-toolbar__plus');
          //   console.log(a);
          //   a[0].click();
          //   a[0].blur();
          // }, 500);
        }),
        onChange: (() => {
          // if (this.editor && this.editor.save) {
          //   this.editor.save().then((outputData) => {
          //     // console.log(outputData);
          //     this.output.emit([...outputData.blocks]);
          //   }).catch((error) => {
          //     console.log('Saving failed: ', error);
          //   });
          // }

          this.addControlsIfVideoElement();
        })

      });
    }
  }

  /** When User will upload / load a video, this method will set an attribute "controls" to show video controls */
  addControlsIfVideoElement() {
    if (isPlatformBrowser(this._platformId) && this.editorRef.nativeElement) {
      this.editorRef.nativeElement.querySelectorAll('video').forEach((v: HTMLVideoElement) => {
        if (!v.hasAttribute('controls')) {
          v.setAttribute('controls', '');
        }
      });
    }
  }

  /** On click on every image of the editor zoom in */
  zoomInZoomOutForImages() {
    /** Checking if editor referene is there */
    if (this.editorViewRef && isPlatformBrowser(this._platformId)) {
      /** FInding and running the loop over all the img elements in editor reference */

      this.editorViewRef.nativeElement.querySelectorAll('img').forEach((v: HTMLImageElement) => {
        /** Setting zoom icon in normal mode */
        v.style.cursor = 'zoom-in';

        /** Listening to onclick method */
        v.onclick = (a) => {

          /** Adding/Removing lightbox class in parent div element */
          v.parentElement.classList.toggle('lightbox');

          /** Adding/Removing lightbox-img class in img element */
          v.classList.toggle('lightbox-img');
        };
      });
    }
  }

  /** Check if media is image */
  isImage(filePath: string) {
    return filePath && this.extensions.has(path.extname(filePath).slice(1).toLowerCase());
  }

  /** Zoom in & Out on image click */
  zoomInOut(e) {
    // e.path[1].classList.toggle('lightbox');
    // e.path[0].classList.toggle('lightbox-img')
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

  insertNewBlock(type: string) {
    this.editor.blocks.insert(type, {}, {}, this.editorRef.nativeElement.getElementsByClassName('ce-block').length, true);
    this.editor.focus(true);
  }

}
