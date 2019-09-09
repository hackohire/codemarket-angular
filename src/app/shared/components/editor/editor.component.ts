import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';
import List from '@editorjs/list';
import Marker from '@editorjs/marker';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import Warning from '@editorjs/warning';
import { Storage } from 'aws-amplify';
import { environment } from 'src/environments/environment';
import { CodeWithLanguageSelection } from 'src/app/insert-code-snippet';
import { HighlightJS } from 'ngx-highlightjs';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class EditorComponent implements OnInit, OnDestroy {

  editor: EditorJS;
  @Input() id: string;
  @Input() readOnly = false;
  @Input() data: [];
  @Output() output: EventEmitter<any> = new EventEmitter();


  constructor(
    private _hljs: HighlightJS
  ) {
  }

  ngOnInit() {

    // Text Editor With Plugin and Configuration

    this.editor = new EditorJS({
      tools: {
        header: Header,
        warning: {
          class: Warning,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+W',
          config: {
            titlePlaceholder: 'Title',
            messagePlaceholder: 'Message',
          },
        },
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
        quote: {
          class: Quote,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+O',
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        image: {
          class: ImageTool,
          config: {
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
            readOnly: this.readOnly
          }
        },
      },
      holder: this.id,
      data: {
        blocks: this.data && this.data.length ? this.data : null
      },
      placeholder: 'Let`s write!',
      onReady: (() => {

        // Get all the code elements from DOM and highlight them as code snippets using highlight.js
        document.querySelectorAll('pre code').forEach((block: HTMLElement) => {
          this._hljs.highlightBlock(block);
        });
      }),
      onChange: (() => {
        this.editor.save().then((outputData) => {
          // console.log('Article data: ', outputData);
          this.output.emit([...outputData.blocks]);
          // this.askForHelpForm.get('description').setValue(outputData.blocks, { emitEvent: false });
        }).catch((error) => {
          console.log('Saving failed: ', error);
        });
      })

    });

  }

  ngOnDestroy() {
    if (this.editor) {
      this.editor.destroy();
    }
  }

  handleEnterKeyPress(e: Event) {
    // e.preventDefault();
    // e.stopPropagation()
  }

}
