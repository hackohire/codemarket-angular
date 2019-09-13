import { Injectable } from '@angular/core';
import { Design } from '../shared/models/design.model';
import { Observable } from 'rxjs';
import gql from 'graphql-tag';
import { description } from '../shared/constants/fragments_constatnts';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { AuthService } from '../core/services/auth.service';
import { SetSelectedDesign } from '../core/store/actions/design.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../core/store/state/app.state';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DesignService {

  designQueryFields = gql`
  fragment Design on Design {
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


  getDesignsByUserId(userId: string, status: string): Observable<Design[]> {
    return this.apollo.query(
      {
        query: gql`
          query getDesignsByUserId($userId: String, $status: String) {
            getDesignsByUserId(userId: $userId, status: $status) {
              ...Design
            }
          }
          ${this.designQueryFields}
        `,
        variables: {
          userId: userId,
status: status
        },
        fetchPolicy:  'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getDesignsByUserId;
      }),
    );
  }


  getAllDesigns(): Observable<Design[]> {
    return this.apollo.query(
      {
        query: gql`
          query getAllDesigns {
            getAllDesigns {
              ...Design
            }
          }
          ${this.designQueryFields}
        `,
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getAllDesigns;
      }),
    );
  }

  getDesignById(DesignId: string): Observable<Design> {
    return this.apollo.query(
      {
        query: gql`
          query getDesignById($DesignId: String) {
            getDesignById(designId: $DesignId) {
              ...Design
            }
          }
          ${this.designQueryFields}
        `,
        variables: {
          DesignId: DesignId
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.getDesignById;
      }),
    );
  }


  addDesign(design: Design): Observable<Design> {
    return this.apollo.mutate({
      mutation: gql`
        mutation addDesign($design: DesignInput) {
          addDesign(design: $design) {
            ...Design
          }
        }
        ${this.designQueryFields}
      `,
      variables: {
        design: design
      }
    }).pipe(
      map(q => q.data.addDesign)
    );
  }

  updateDesign(design: Design): Observable<Design> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation updateDesign($design: DesignInput) {
            updateDesign(design: $design) {
              ...Design
            }
          }
          ${this.designQueryFields}
        `,
        variables: {
          design: design
        }
      }
    ).pipe(
      map((p) => p.data.updateDesign),
    );
  }

  deleteDesign(designId: string): Observable<boolean> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation deleteDesign($designId: String) {
            deleteDesign(designId: $designId)
          }
        `,
        variables: {
          designId: designId
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.deleteDesign;
      }),
    );
  }

  redirectToDesignDetails(design: Design): void {
    this.store.dispatch(SetSelectedDesign({ design }));
    this.router.navigate(['/', { outlets: { main: ['dashboard', 'design-details', design._id] } }]);
  }
}
