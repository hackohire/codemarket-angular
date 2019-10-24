import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { description } from '../shared/constants/fragments_constatnts';
import { Company } from '../shared/models/company.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  companyFileds = gql`
  fragment Company on Company {
    _id
    name
    title
    type
    cities {
      name
      _id
    }  
    howCanYouHelp {
      ...Description
    }
    status
    createdAt
    updatedAt
    createdBy {
      _id
      name
      avatar
    }
  }
  ${description}
  `;


  constructor(
    private apollo: Apollo
  ) { }

  addCompany(company: Company): Observable<Company> {
    return this.apollo.mutate({
      mutation: gql`
        mutation addCompany($company: CompanyInput) {
          addCompany(company: $company) {
            ...Company
          }
        }
        ${this.companyFileds}
      `,
      variables: {
        company: company
      }
    }).pipe(
      map((q: any) => q.data.addCompany)
    );
  }

  updateCompany(company: Company): Observable<Company> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation updateCompany($company: CompanyInput) {
            updateCompany(company: $company) {
              ...Company
            }
          }
          ${this.companyFileds}
        `,
        variables: {
          company: company
        }
      }
    ).pipe(
      map((p: any) => p.data.updateCompany),
    );
  }

  getAllCompanies(): Observable<Company[]> {
    return this.apollo.query(
      {
        query: gql`
          query getAllCompanies {
            getAllCompanies {
              ...Company
            }
          }
          ${this.companyFileds}
        `,
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getAllCompanies;
      }),
    );
  }

  getCompaniesByUserIdAndType(userId: string, companyType: string): Observable<Company[]> {
    return this.apollo.query(
      {
        query: gql`
          query getCompaniesByUserIdAndType($userId: String, $companyType: String) {
            getCompaniesByUserIdAndType(userId: $userId, companyType: $companyType) {
              ...Company
            }
          }
          ${this.companyFileds}
        `,
        variables: {
          userId: userId,
          companyType: companyType
        },
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getCompaniesByUserIdAndType;
      }),
    );
  }


  getCompaniesByType(companyType: string): Observable<Company[]> {
    return this.apollo.query(
      {
        query: gql`
          query getCompaniesByType($companyType: String) {
            getCompaniesByType(companyType: $companyType) {
              ...Company
            }
          }
          ${this.companyFileds}
        `,
        variables: {
          companyType
        },
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getCompaniesByType;
      }),
    );
  }

  getCompanyById(CompanyId: string): Observable<Company> {
    return this.apollo.query(
      {
        query: gql`
          query getCompanyById($CompanyId: String) {
            getCompanyById(companyId: $CompanyId) {
              ...Company
            }
          }
          ${this.companyFileds}
        `,
        variables: {
          CompanyId: CompanyId
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.getCompanyById;
      }),
    );
  }

  deleteCompany(companyId: string): Observable<boolean> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation deleteCompany($companyId: String) {
            deleteCompany(companyId: $companyId)
          }
        `,
        variables: {
          companyId: companyId
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.deleteCompany;
      }),
    );
  }
}