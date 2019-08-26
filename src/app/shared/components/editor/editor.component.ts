import { Component, OnInit, EventEmitter, Output, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';
import { Storage } from 'aws-amplify';
import { environment } from 'src/environments/environment';
import { CodeWithLanguageSelection } from 'src/app/insert-code-snippet';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class EditorComponent implements OnInit, OnDestroy {

  editor: EditorJS;
  @Input() id: string;
  @Input() readOnly: boolean = false;
  @Input() data: [];
  @Output() output: EventEmitter<any> = new EventEmitter();


  constructor() {
  }

  ngOnInit() {

    console.log(this.id)
    // Text Editor With Plugin and Configuration

    this.editor = new EditorJS({
      tools: {
        header: Header,
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
      onChange: (() => {
        this.editor.save().then((outputData) => {
          console.log('Article data: ', outputData);
          this.output.emit(outputData.blocks);
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
