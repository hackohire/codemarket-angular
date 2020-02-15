import { Component, OnInit, Input, forwardRef, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { concat, of, Subscription } from 'rxjs';
import { distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { FormService } from '../../services/form.service';
import { FormControl } from '@angular/forms';
import { CompanyService } from '../../../companies/company.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent implements OnInit, OnDestroy {

  public items$: Observable<any[]>;
  public itemsLoading = false;
  public itemInput$ = new Subject<string>();

  private subscription$ = new Subscription();

  @Input() collection: string;
  @Input() type: string;
  @Input() autoComplete: FormControl;
  @Input() placeholder: string;
  @Input() multiple = false;
  // @Input() controlName: string;

  constructor(
    private formService: FormService,
    private companyService: CompanyService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.items$ = concat(
      of([]), // default items
      this.itemInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.itemsLoading = true),
        switchMap(term => this.formService.findFromCollection(term, this.collection, this.type).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.itemsLoading = false)
          ))
        )
    );
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  public add = (name) => {
    return this.formService.addToCollection(name, this.collection, this.type).toPromise();
  }

  addCompany = (name: string) => {
    if (name) {
      return new Promise((resolve, reject) => {
        this.subscription$.add(
          this.companyService.addCompany({name, createdBy: this.authService.loggedInUser._id}).subscribe(c => {
            return resolve(c.name);
          })
        );
      });
    }
  }

}
