import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MakeMoney } from '../shared/models/makemony.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MakemoneyonlineService {

  makeMonyFileds = gql`
  fragment MakeMoney on MakeMoney {
    firstName
    lastName
    email
    phone
    haveBusiness
    describeBusiness
    WebsiteLink
    businessAddress
  }`;

  constructor(
    private apollo: Apollo,
    private router: Router,
  ) { }


  addMakeMoney(makeMoney: any): Observable<MakeMoney> {
    return this.apollo.mutate({
      mutation: gql`
        mutation addMakeMoney($makeMoney: MakeMoneyInput) {
          addMakeMoney(makeMoney: $makeMoney) {
            ...MakeMoney
          }
        }
        ${this.makeMonyFileds}
      `,
      variables: {
        makeMoney
      }
    }).pipe(
      map((q: any) => q.data.addMakeMoney)
    );
  }

  redirectToCompanyDetails(companyId: string, view = 'home') {
    this.router.navigate(['/', 'dashboard']);
  }


  
  fetchMakeMoney(): Observable<any> {
    return this.apollo.query({
      query: gql`
        query fetchMakeMoney {
          fetchMakeMoney{
            firstName
            lastName
            email
            phone
            haveBusiness
            describeBusiness
            WebsiteLink
            businessAddress
          }
        }
      `,
      variables: {
      }
    }).pipe(
      map((q: any) => q.data.fetchMakeMoney)
    );
  }
}
