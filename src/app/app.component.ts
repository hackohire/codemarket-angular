import { Component, OnDestroy } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { timer, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from './core/store/state/app.state';
import { GetCartProductsList } from './core/store/actions/cart.actions';
import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { VideoChatComponent } from './video-chat/video-chat.component';
import { UserService } from './user/user.service';
import Peer from 'peerjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'codemarket';
  private subscription = new Subscription();
  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    public dialog: MatDialog,
    private userService: UserService
  ) {

    const source = timer(1200000);

    this.subscription.add(
      source.subscribe(val => {
        this.authService.checkIfUserIsLoggedIn();
        console.log('===========================================================', val);
      })
    );

    this.subscription.add(
      this.authService.loggedInUser$.pipe(
        tap((u) => {
          if (u) {

            const peer = new Peer(u._id);

            peer.on('open', (id) => {
              console.log('My peer ID is: ' + id);
              if (id) {
                this.userService.peer.next(peer);
              }
            });

            peer.on('call', (call) => {
              console.log(call);
              // if (true) {
              this.openDialog(call, peer);
              // }
            });


            // this.webSocketService.subject.subscribe(async (d: any) => {
            //   console.log(d);
            //   if (d && d.userWhoIsCalling && !this.dialog.openDialogs.length) {
            //     // this.openDialog(d.channel);
            //   }
            // });
            this.store.dispatch(GetCartProductsList());
          }
        })
      ).subscribe()
    );

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openDialog(call, peer): void {
    this.dialog.open(VideoChatComponent, {
      width: '550px',
      data: {isSomeoneCalling: true, call, peer},
      disableClose: true
    });
  }
}


