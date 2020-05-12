import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {FormJson} from '../shared/models/FormJson.model';
import {FormData} from '../shared/models/FormData.model';
import {BankFormDataRef} from '../shared/models/bankFormDataRef.model';



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

  addformJson(formJson: any): Observable<FormJson> {
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
            company{
              _id
            }
            connectedFormStructureId
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


  addBankFormDataRef(bankFormDataRef: any): Observable<BankFormDataRef> {
    return this.apollo.mutate({
      mutation: gql`
        mutation addBankFormDataRef($bankFormDataRef: bankFormDataRefInput) {
          addBankFormDataRef(bankFormDataRef: $bankFormDataRef) {
            _id
            formname
            connectedFormStructureId
            connectedFormDataId
            companyName
          }
        }
      `,
      variables: {
        bankFormDataRef
      }
    }).pipe(
      map((q: any) => q.data.addBankFormDataRef)
    );
  }

  redirectToBack(companyId: string, view = 'home') {
    this.router.navigate(['/', 'dashboard']);
  }

  fetchformDataById(_id: string, connectedFormStructureId: string) {
    return this.apollo.query({
      query: gql`
        query fetchformDataById($_id: String,$connectedFormStructureId: String) {
          fetchformDataById(_id: $_id,connectedFormStructureId: $connectedFormStructureId){
            formname
            formDataJson
            connectedFormStructureId
          }
        }
      `,
      variables: {
        _id,
        connectedFormStructureId
      }
    }).pipe(
      map((q: any) => q.data.fetchformDataById)
    );
  }

  fetchFormDataByFormId(formId: string, fetchPrograms = false) {
    return this.apollo.query({
      query: gql`
        query fetchFormDataByFormId($formId: String, $fetchPrograms: Boolean) {
          fetchFormDataByFormId(formId: $formId, fetchPrograms: $fetchPrograms){
            _id
            formname
            formDataJson
            connectedFormStructureId
          }
        }
      `,
      variables: {
        formId,
        fetchPrograms
      }
    }).pipe(
      map((q: any) => q.data.fetchFormDataByFormId)
    );
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

  fetchHomeBuyerProgram(location: string): Observable<any> {
    return this.apollo.query({
      query: gql`
        query fetchHomeBuyerProgram($location: String) {
          fetchHomeBuyerProgram(location: $location){
            title
            location
            benefits
            featuredLenderLink
            websiteLink
          }
        }
      `,
      variables: {
        location
      }
    }).pipe(
      map((q: any) => q.data.fetchHomeBuyerProgram)
    );
  }

}
