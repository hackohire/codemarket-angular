import { Injectable } from '@angular/core';
import { Howtodoc } from '../shared/models/howtodoc.model';
import { Observable } from 'rxjs';
import gql from 'graphql-tag';
import { description } from '../shared/constants/fragments_constatnts';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { AuthService } from '../core/services/auth.service';
import { SetSelectedHowtodoc } from '../core/store/actions/howtodoc.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../core/store/state/app.state';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HowtodocService {

  howtodocQueryFields = gql`
  fragment Howtodoc on Howtodoc {
    _id
    name
    categories
    description {
      ...Description
    }
    price
    status
    createdAt
    updatedAt
    tags {
      name
      _id
    }
    support {
      time
      description {
        ...Description
      }
    }
    likeCount
    createdBy {
      _id
      name
      avatar
    }
  }
  ${description}
  `;

  constructor(
    private apollo: Apollo,
    private auth: AuthService,
    private store: Store<AppState>,
    private router: Router
  ) { }


  getHowtodocsByUserId(userId: string, status: string): Observable<Howtodoc[]> {
    return this.apollo.query(
      {
        query: gql`
          query getHowtodocsByUserId($userId: String, $status: String) {
            getHowtodocsByUserId(userId: $userId, status: $status) {
              ...Howtodoc
            }
          }
          ${this.howtodocQueryFields}
        `,
        variables: {
          userId: userId,
status: status
        },
        fetchPolicy:  'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getHowtodocsByUserId;
      }),
    );
  }


  getAllHowtodocs(): Observable<Howtodoc[]> {
    return this.apollo.query(
      {
        query: gql`
          query getAllHowtodocs {
            getAllHowtodocs {
              ...Howtodoc
            }
          }
          ${this.howtodocQueryFields}
        `,
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getAllHowtodocs;
      }),
    );
  }

  getHowtodocById(HowtodocId: string): Observable<Howtodoc> {
    return this.apollo.query(
      {
        query: gql`
          query getHowtodocById($HowtodocId: String) {
            getHowtodocById(howtodocId: $HowtodocId) {
              ...Howtodoc
            }
          }
          ${this.howtodocQueryFields}
        `,
        variables: {
          HowtodocId: HowtodocId
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.getHowtodocById;
      }),
    );
  }


  addHowtodoc(howtodoc: Howtodoc): Observable<Howtodoc> {
    return this.apollo.mutate({
      mutation: gql`
        mutation addHowtodoc($howtodoc: HowtodocInput) {
          addHowtodoc(howtodoc: $howtodoc) {
            ...Howtodoc
          }
        }
        ${this.howtodocQueryFields}
      `,
      variables: {
        howtodoc: howtodoc
      }
    }).pipe(
      map(q => q.data.addHowtodoc)
    );
  }

  updateHowtodoc(howtodoc: Howtodoc): Observable<Howtodoc> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation updateHowtodoc($howtodoc: HowtodocInput) {
            updateHowtodoc(howtodoc: $howtodoc) {
              ...Howtodoc
            }
          }
          ${this.howtodocQueryFields}
        `,
        variables: {
          howtodoc: howtodoc
        }
      }
    ).pipe(
      map((p) => p.data.updateHowtodoc),
    );
  }

  deleteHowtodoc(howtodocId: string): Observable<boolean> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation deleteHowtodoc($howtodocId: String) {
            deleteHowtodoc(howtodocId: $howtodocId)
          }
        `,
        variables: {
          howtodocId: howtodocId
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.deleteHowtodoc;
      }),
    );
  }

  redirectToHowtodocDetails(howtodoc: Howtodoc): void {
    this.store.dispatch(SetSelectedHowtodoc({ howtodoc }));
    this.router.navigate(['/', { outlets: { main: ['dashboard', 'howtodoc-details', howtodoc._id] } }]);
  }
}
