import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/internal/operators/map';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  bookingFields = `
    referenceId {
      name
      _id
      slug
      type
      createdBy {
        name
        avatar
        _id
      }
    }
    _id
    schedule
    expert {
      name
      avatar
      _id
    }
    createdBy {
      name
      avatar
      _id
    }
    status
  `

  constructor(
    private apollo: Apollo,
    private authService: AuthService
  ) { }

  scheduleCall(booking) {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation scheduleCall($booking: BookingInput) {
            scheduleCall(booking: $booking) {
              ${this.bookingFields}
            }
          }
        `,
        variables: {
          booking
        }
      }
    ).pipe(
      map((p: any) => p.data.scheduleCall),
    );
  }

  getBookingList() {
    return this.apollo.query({
      query: gql`
      query getBookingList($userId: String) {
        getBookingList(userId: $userId) {
          ${this.bookingFields}
        }
      }
    `,
      variables: {
        userId: this.authService.loggedInUser._id
      }
    }
    ).pipe(
      map((p: any) => p.data.getBookingList),
    );
  }
}
