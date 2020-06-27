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
            _id
            formname
            formStructureJSON
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

  redirectToFormBuilder() {
    this.router.navigate(['/', 'form-builder']);
  }

  fetchformJson(): Observable<any> {
    return this.apollo.query({
      query: gql`
        query fetchformJson {
          fetchformJson{
            formname
            commonId
            formStructureJSON
            _id
          }
        }
      `,
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
            commonId
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        formId
      }
    }).pipe(
      map((q: any) => q.data.fetchFormStructureById)
    );
  }

  fetchformDataById(formDataId: String): Observable<any> {
    return this.apollo.query({
      query: gql`
        query fetchformDataById($formDataId: String) {
          fetchformDataById(formDataId: $formDataId){
            _id
            formname
            formDataJson
            connectedFormStructureId
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        formDataId
      }
    }).pipe(
      map((q: any) => q.data.fetchformDataById)
    );
  }

  fetchSavedDataByFormStructure(pageOptions, formStructureId: string): Observable<any> {
    return this.apollo.query({
      query: gql`
        query fetchSavedDataByFormStructure($pageOptions: PageOptionsInput, $formStructureId: String) {
          fetchSavedDataByFormStructure(pageOptions: $pageOptions, formStructureId: $formStructureId){
            total
            data {
              _id
              formname
              formDataJson
              commonFormId
              createdBy {
                _id
                name
              }
            }
          }
        }
      `,
      variables: {
        pageOptions,
        formStructureId
      },
      fetchPolicy: 'no-cache'
    }).pipe(
      map((q: any) => q.data.fetchSavedDataByFormStructure)
    );
  }

  addSurveyUser(addSurveyUserObj: any): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation addSurveyUser($addSurveyUserObj: AddSurveyUserInput) {
        addSurveyUser(addSurveyUserObj: $addSurveyUserObj) {
          _id
          email
          firstName
          lastName
          alreadyExist
        }
      }
      `,
      variables: {
        addSurveyUserObj
      }
    }).pipe(
      map((q: any) => q.data.addSurveyUser)
    );
  }

  getMySurveyData(pageOptions, id: string): Observable<any> {
    return this.apollo.query({
      query: gql`
        query getMySurveyData($pageOptions: PageOptionsInput, $id: String) {
          getMySurveyData(pageOptions: $pageOptions, id: $id){
            total
            data {
              _id
              formname
              formDataJson
              cFormJson
              pFormJson
              createdAt
              createdBy {
                _id
                name
              }
              connectedFormData {
                _id
                formDataJson
                formname
                formDataId
              }
            }
          }
        }
      `,
      variables: {
        pageOptions,
        id
      },
      fetchPolicy: 'no-cache'
    }).pipe(
      map((q: any) => q.data.getMySurveyData)
    );
  }

  fetchSurveyAndSummaryFormDataById(id: string): Observable<any> {
    return this.apollo.query({
      query: gql`
        query fetchSurveyAndSummaryFormDataById($id: String) {
          fetchSurveyAndSummaryFormDataById(id: $id){
            _id
            formname
            formDataJson
            cFormJson
            pFormJson
            createdAt
            commonFormId
            connectedFormData {
              _id
              formDataJson
              formname
              formDataId
            }
          }
        }
      `,
      variables: {
        id
      },
      fetchPolicy: 'no-cache'
    }).pipe(
      map((q: any) => q.data.fetchSurveyAndSummaryFormDataById)
    );
  }
}
