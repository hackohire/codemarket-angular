import { Component, OnInit, Input, forwardRef, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { concat, of, Subscription } from 'rxjs';
import { distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { FormService } from '../../services/form.service';
import { FormControl, Validators } from '@angular/forms';
import { CompanyService } from '../../../companies/company.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  providers: [CompanyService]
})
export class AutocompleteComponent implements OnInit, OnDestroy {

  /** Items list and state */
  public items$: Observable<any[]>;
  public itemsLoading = false;
  public itemInput$ = new Subject<string>();

  private subscription$ = new Subscription();

  @Input() collection: string;
  @Input() type: string;

  /** multiple - to allow user to select multiple values or only single value */
  @Input() autoComplete: FormControl;

  /** placeholder - the label of the control such as "Select a Company" */
  @Input() placeholder: string;

  /** autocomplete - the actual formcontrol, which is created in parent component */
  @Input() multiple = false;

  @Input() forCompany = false;

  @Input() allowToAdd = true;

  constructor(
    private formService: FormService,
    private companyService: CompanyService,
    private authService: AuthService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.items$ = concat(
      of([]), /** default items */
      this.itemInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.itemsLoading = true),
        switchMap(term => this.formService.findFromCollection(term, this.collection, this.type).pipe(
          catchError(() => of([])), /** empty list on error */
          tap(() => this.itemsLoading = false)
          ))
        )
    );
  }

  /** Destroy the subscription */
  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  /** Add the value if not available */
  public add = (name) => {
    if (this.allowToAdd) {
      return this.formService.addToCollection(name, this.collection, this.type).toPromise();
    } else {
      if (new FormControl(name, Validators.email).valid) {
        return this.userService.createUser({name, email: name}).toPromise();
      } else {
        Swal.fire('If User is not found, You can add the user by adding a valid email', '', 'info');
      }
    }
  }

  addCompany = (name: string) => {
    return this.companyService.addCompany({name, createdBy: this.authService.loggedInUser._id}).toPromise();
  }

}
