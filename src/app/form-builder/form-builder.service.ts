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

  addformJson(formJson : any, connectedDBId: String): Observable<FormJson>{
    return this.apollo.mutate({
      mutation: gql`
        mutation addformJson($formJson: formJsonInput, $connectedDBId: String) {
          addformJson(formJson: $formJson, connectedDBId: $connectedDBId) {
            _id
            formname
            formStructureJSON
            connectedDB {
              _id
              name
            }
          }
        }
      `,
      variables: {
        formJson,
        connectedDBId
      }
    }).pipe(
      map((q: any) => q.data.addformJson)
    );
  }

  redirectToFormBuilder() {
    this.router.navigate(['/', 'form-builder']);
  }

  fetchformJson(): Observable<any> {
    return this.apollo.query({
      query: gql`
        query fetchformJson {
          fetchformJson{
            formname
            formStructureJSON
            _id
          }
        }
      `,
      fetchPolicy: 'no-cache',
      variables: {
      }
    }).pipe(
      map((q: any) => q.data.fetchformJson)
    );
  }

  addformData(formData: any): Observable<FormData> {
    return this.apollo.mutate({
      mutation: gql`
        mutation addformData($formData: formDataInput) {
          addformData(formData: $formData) {
            _id
            formname
            formDataJson
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
    this.router.navigate(['/', 'dashboard']);
  }

  fetchformData(formname: string): Observable<any> {
    return this.apollo.query({
      query: gql`
        query fetchformData($formname: String) {
          fetchformData(formname: $formname){
            _id
            formname
            formDataJson
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

  fetchFormStructureById(formId: string): Observable<any> {
    return this.apollo.query({
      query: gql`
        query fetchFormStructureById($formId: String) {
          fetchFormStructureById(formId: $formId){
            _id
            formname
            formStructureJSON
            connectedDB {
              _id
              name
            }
            createdAt
            updatedAt
          }
        }
      `,
      fetchPolicy: 'no-cache',
      variables: {
        formId
      }
    }).pipe(
      map((q: any) => q.data.fetchFormStructureById)
    );
  }

  addIntoAnotherDB(formJson: any, connectedDBId: String, collection: String): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation addIntoAnotherDB($formJson: formJsonInput, $connectedDBId: String, $collection: String) {
          addIntoAnotherDB(formJson: $formJson, connectedDBId: $connectedDBId, collection: $collection) {
            _id
            formname
            formStructureJSON
          }
        }
      `,
      variables: {
        formJson,
        connectedDBId,
        collection
      }
    }).pipe(
      map((q: any) => q.data.addIntoAnotherDB)
    );
  }
}
