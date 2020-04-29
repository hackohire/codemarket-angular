import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {FormJson} from '../shared/models/FormJson.model';
import {FormData} from '../shared/models/FormData.model';


@Injectable({
  providedIn: 'root'
})
export class FormBuilderService {
  formJsonFileds = gql`
  fragment formJson on formJson {
    formname
    jsonstring
  }`;

  constructor(
    private apollo: Apollo,
    private router: Router,
  ) { }

  addformJson(formJson : any): Observable<FormJson>{
    return this.apollo.mutate({
      mutation: gql`
        mutation addformJson($formJson: formJsonInput) {
          addformJson(formJson: $formJson) {
            formname
            jsonstring
          }
        }
      `,
      variables: {  
        formJson   
      }
    }).pipe(
      map((q: any) => q.data.addformJson)
    );
  }

  redirectToCompanyDetails(companyId: string, view = 'home') {
    this.router.navigate(['/', 'form-builder']);
  }

  fetchformJson(): Observable<any> {
    return this.apollo.query({
      query: gql`
        query fetchformJson {
          fetchformJson{
            formname
            jsonstring
          }
        }
      `,
      variables: {
      }
    }).pipe(
      map((q: any) => q.data.fetchformJson)
    );
  }

  addformData(formData : any): Observable<FormData>{
    return this.apollo.mutate({
      mutation: gql`
        mutation addformData($formData: formDataInput) {
          addformData(formData: $formData) {
            formname
            jsonstring
          }
        }
      `,
      variables: {  
        formData   
      }
    }).pipe(
      map((q: any) => q.data.addformData)
    );
  }

  redirectToBack(companyId: string, view = 'home') {
    this.router.navigate(['/', 'form-builder']);
  }

  fetchformData(formname: string): Observable<any> {
    return this.apollo.query({
      query: gql`
        query fetchformData($formname: String) {
          fetchformData(formname: $formname){
            formname
            jsonstring
          }
        }
      `,
      variables: {
        formname
      }
    }).pipe(
      map((q: any) => q.data.fetchformData)
    );
  }


}
