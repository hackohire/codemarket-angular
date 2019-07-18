import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  createUser(user): Observable<any> {
    return of([]);
  }

  updateUser(user) {
    return of(null);
  }
}
