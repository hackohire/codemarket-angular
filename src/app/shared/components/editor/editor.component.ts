import { Component, OnInit, EventEmitter, Output, Input, OnDestroy, OnChanges, AfterViewInit, SimpleChanges, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
// import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';
import List from '@editorjs/list';
import Marker from '@editorjs/marker';
// import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import Embed from '@editorjs/embed';
// import Warning from '@editorjs/warning';
import  Storage  from '@aws-amplify/storage';
import { environment } from 'src/environments/environment';
import { CodeWithLanguageSelection } from 'src/app/insert-code-snippet';
import { HighlightJS } from 'ngx-highlightjs';
import { appConstants } from '../../constants/app_constants';
import { FormGroup, FormControl } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { CommentService } from '../../services/comment.service';
import { Post } from '../../models/post.model';
import { Comment } from '../../models/comment.model';
import { isPlatformBrowser } from '@angular/common';
const path = require('path');
declare const EditorJS;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class EditorComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {

  editor: any;
  isPlatformBrowser = false;
  @Input() post: Post; /** post for view mode */
  @Input() id: string;
  @Input() readOnly = false; /** read only mode */
  @Input() data: [];
  @Input() placeholder: string;
  @Input() commentType: string;
  @Output() output: EventEmitter<any> = new EventEmitter(); /** Emitting data with user interactions */
  @ViewChild('editorRef', { static: false }) editorRef: ElementRef;

  @Input() editorStyle = {
    background: '#eff1f570',
    padding: '15px',
    border: 'dotted #ececec'
  };

  /** Variables related to block level comments */
  @Input() blockLevelComments = false;
  @Input() commentsList: Comment[]
  anonymousAvatar = '../../../../assets/images/anonymous-avatar.jpg';
  codemarketBucketURL = environment.codemarketFilesBucket;

  commentForm: FormGroup;

  extensions = new Set(appConstants.imageExtenstions);

  constructor(
    private _hljs: HighlightJS,
    public authService: AuthService,
    public commentService: CommentService,
    @Inject(PLATFORM_ID) public _platformId: Object
  ) {
    this.isPlatformBrowser = isPlatformBrowser(this._platformId);
  }

  ngOnInit() {

    if (!this.readOnly) {
      this.initiateEditor();
    }

    if (this.post) {
      this.initializeCommentForm(this.post);
    }
  }

  ngAfterViewInit(): void {
    /** Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
     * Add 'implements AfterViewInit' to the class.
    */

    /** Get all the code elements from DOM and highlight them as code snippets using highlight.js */
    if (this.editorRef && isPlatformBrowser(this._platformId) && this.editorRef.nativeElement) {
      this.editorRef.nativeElement.querySelectorAll('pre code').forEach((block: HTMLElement) => {
        this._hljs.highlightBlock(block);
      });
    }
    this.zoomInZoomOutForImages();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.editor && this.editor.blocks && changes.readOnly && !changes.readOnly.currentValue) {
      console.log(this.editor);
      this.editor.destroy();
      this.readOnly = false;
      this.initiateEditor();
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
  }

  initializeCommentForm(p) {
    this.commentForm = new FormGroup({
      text: new FormControl(''),
      referenceId: new FormControl(p._id),
      type: new FormControl(this.commentType ? this.commentType : p.type),
      blockSpecificComment: new FormControl(true),
      blockId: new FormControl('')
    });
  }

  addComment(blockId: string) {
    console.log(this.commentForm.value);
    if (this.authService.loggedInUser) {
      this.commentForm.addControl('createdBy', new FormControl(this.authService.loggedInUser._id));
      this.commentForm.get('blockId').setValue(blockId),

        this.commentService.addComment(this.commentForm.value).pipe(
          tap((d) => {
            console.log(d);
            if (d) {
              this.commentsList.push(d);
              // this.commentsList = d;
            }
          })
        ).subscribe();
    }
  }

  updateFormData(event) {
    this.commentForm.get('text').setValue(event);
  }

  initiateEditor(blocks = null) {
    // Text Editor With Plugin and Configuration

    console.log(this.id);
    if (isPlatformBrowser(this._platformId)) {
      this.editor = new EditorJS({
        tools: {
          header: Header,
          /** Config Editor.js For Embedding Youtube Videos and Codepen and etc */
          embed: {
            class: Embed,
            inlineToolbar: true
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
              cols: 3,
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
                 * @param {File} file - file selected from the device or pasted by drag-n-drop
                 * @return {Promise.<{success, file: {url}}>}
                 */
                uploadByFile(file) {
                  // your own uploading logic here
  
                  const fileNameSplitArray = file.name.split('.');
                  const fileExt = fileNameSplitArray.pop();
                  const fileName = fileNameSplitArray[0] + '-' + new Date().toISOString() + '.' + fileExt;
  
                  return Storage.vault.put(fileName, file, {
  
                    bucket: 'codemarket-files',
  
                    level: 'public',
  
                    contentType: file.type,
                  }).then((uploaded: any) => {
                    console.log('uploaded', uploaded);
                    return {
                      success: 1,
                      file: {
                        url: environment.codemarketFilesBucket + uploaded.key,
                        // any other image data you want to store, such as width, height, color, extension, etc
                      }
                    };
                  });
                },
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
  
          // Get all the code elements from DOM and highlight them as code snippets using highlight.js
          if ( isPlatformBrowser(this._platformId) && this.editorRef.nativeElement) {
            this.editorRef.nativeElement.querySelectorAll('pre code').forEach((block: HTMLElement) => {
              this._hljs.highlightBlock(block);
            });
  
            if (this.readOnly && isPlatformBrowser(this._platformId)) {
              const elements = document.querySelectorAll('[contenteditable=true]');
              elements.forEach(element => {
                element.setAttribute('contenteditable', 'false');
              });
            }
          }
  
          this.addControlsIfVideoElement();
          this.zoomInZoomOutForImages();
        }),
        onChange: (() => {
          this.editor.save().then((outputData) => {
            console.log(outputData);
            this.output.emit([...outputData.blocks]);
          }).catch((error) => {
            console.log('Saving failed: ', error);
          });
  
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
    if (this.editorRef && isPlatformBrowser(this._platformId)) {
      /** FInding and running the loop over all the img elements in editor reference */

      this.editorRef.nativeElement.querySelectorAll('img').forEach((v: HTMLImageElement) => {
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
  deleteComment(id: string) {
    this.commentsList = this.commentsList.filter(c => c._id !== id);
  }

}
