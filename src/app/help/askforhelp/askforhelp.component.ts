import { Component, OnInit } from '@angular/core';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductStatus } from 'src/app/shared/models/product.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { AddQuery } from 'src/app/core/store/actions/help.actions';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-askforhelp',
  templateUrl: './askforhelp.component.html',
  styleUrls: ['./askforhelp.component.scss']
})
export class AskforhelpComponent implements OnInit {

  breadcumb: BreadCumb;
  askForHelpForm: FormGroup;
  modules = {
    formula: true,
    syntax: true,
  };

  get createdBy() {
    return this.askForHelpForm.get('createdBy');
  }

  constructor(
    private store: Store<AppState>,
    private authService: AuthService
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
      createdBy: new FormControl()
    });
  }

  submit() {
    console.log(this.askForHelpForm.value);
    if (this.authService.loggedInUser && !this.createdBy.value) {
      this.createdBy.setValue(this.authService.loggedInUser._id);
    }
    this.store.dispatch(new AddQuery(this.askForHelpForm.value));
  }

}
