import { Injectable } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { Tag } from '../models/product.model';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(
    private apollo: Apollo
  ) { }


  addCategory(categoriesFormControl: FormArray, event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      // const a = new FormControl({name: value.trim()});
      // categoriesFormControl.controls.push(a);
      categoriesFormControl.push(new FormControl({name: value.trim()}));
      // categoriesFormControl.value.push({name: value.trim()});
      // this.productForm.updateValueAndValidity({emitEvent: true});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  selectedCategory(categoriesFormControl: FormArray, event) {
    const value = event.option.value;

    // const a = new FormControl({name: value.name, _id: value._id});
    // categoriesFormControl.controls.push(a);
    categoriesFormControl.push(new FormControl({name: value.name, _id: value._id}));
  }

  valueChange(searchText: FormControl) {
    return this.searchCategories('');
  }


  // Remove a Tag
  public removeCategory(categoriesFormControl: FormArray, index: number): void {
    categoriesFormControl.removeAt(index);
    // this.productForm.updateValueAndValidity();
  }

  searchCategories(keyWord: string): Observable<Tag[]> {
    return this.apollo.query(
      {
        query: gql`
          query searchCategories($keyWord: String) {
            searchCategories(keyWord: $keyWord) {
              _id
              name
            }
          }
        `,
        variables: {
          keyWord: keyWord
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.searchCategories;
      }),
    );
  }


}
