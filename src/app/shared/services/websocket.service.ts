
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { AuthService } from 'src/app/core/services/auth.service';
import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class WebsocketService {

  subject: WebSocketSubject<any>;
  constructor(
    private authService: AuthService,
    private dialog: MatDialog
  ) {

    this.authService.loggedInUser$.pipe(
      tap((u) => {
        if (u) {
          this.subject = new WebSocketSubject({
            url: environment.webSocketURL, openObserver: {
              next: (val: any) => {
                console.log('opened');
                this.subject.next({ action: 'setUserOnline', userId: this.authService.loggedInUser._id });
                this.connect();
              }
            }
          });
        }
      })
    ).subscribe();

    // setTimeout(() => {
    //   this.subject.next({ action: 'setUserOnline', userId: this.authService.loggedInUser._id });
    // }, 10000);
  }

  connect() {
    // this.subject =  webSocket('ws://localhost:3001');
    this.subject.subscribe((d: any) => {
      console.log(d);
      if (d && d.isConnected) {
        // this.subject.next({ action: 'setUserOnline', userId: this.authService.loggedInUser._id });
      }

      if (d && d.isUserOnline) {
      }
    });

  }

  update(data, action = 'onOffer') {
    this.subject.next({ action: action, message: data });
  }

}
