import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductStatus } from 'src/app/shared/models/product.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { AddQuery } from 'src/app/core/store/actions/help.actions';
import { AuthService } from 'src/app/core/services/auth.service';
import EditorJS from '@editorjs/editorjs';


@Component({
  selector: 'app-askforhelp',
  templateUrl: './askforhelp.component.html',
  styleUrls: ['./askforhelp.component.scss']
})
export class AskforhelpComponent implements OnInit {
  urlRegex = '^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$';
  breadcumb: BreadCumb;
  askForHelpForm: FormGroup;
  modules = {
    formula: true,
    syntax: true,
  };


  get createdBy() {
    return this.askForHelpForm.get('createdBy');
  }

  get idFromControl() {
    return this.askForHelpForm.get('_id');
  }

  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
  ) {

    this.breadcumb = {
      title: 'Ask For Help By Filling out the given form',
      path: [
        {
          name: 'Dashboard'
        },
        {
          name: 'Help'
        }
      ]
    };

    this.askForHelpFormInitialization();
  }

  ngOnInit() {
  }


  askForHelpFormInitialization(): void {
    this.askForHelpForm = new FormGroup({
      question: new FormControl(''),
      description: new FormControl(''),
      price: new FormControl(''),
      createdBy: new FormControl(),
      shortDescription: new FormControl(),
      categories: new FormControl(null),
      demo_url: new FormControl('', [Validators.pattern(this.urlRegex)]),
      documentation_url: new FormControl('', [Validators.pattern(this.urlRegex)]),
      video_url: new FormControl('', [Validators.pattern(this.urlRegex)]),
      status: new FormControl(ProductStatus.Created),
      _id: new FormControl(''),
      snippets: new FormControl(null),
    });
  }

  submit() {
    console.log(this.askForHelpForm.value);

    /* Identify the programming language based on code snippets  **/
    // const codeSnippets = [].slice.call(document.getElementsByTagName('pre'), 0);
    // if (codeSnippets.length) {
    //   const snips = [];
    //   for (const s of codeSnippets) {
    //     const snip = this._hljs.highlightAuto(s.innerText, ['javascript', 'typescript', 'scss']);
    //     snips.push(snip);
    //   }
    //   this.askForHelpForm.value.snips = snips;
    //   console.log(snips);
    // }



    if (this.authService.loggedInUser && !this.createdBy.value) {
      this.createdBy.setValue(this.authService.loggedInUser._id);
    }

    if (this.idFromControl && !this.idFromControl.value) {
      this.askForHelpForm.removeControl('_id');
    }

    this.store.dispatch(new AddQuery(this.askForHelpForm.value));
  }

  updateFormData(event) {
    console.log(event);
    this.askForHelpForm.get('description').setValue(event, {emitEvent: false, onlySelf: true});
  }

}
