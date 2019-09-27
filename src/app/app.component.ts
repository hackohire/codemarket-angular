import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { timer } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from './core/store/state/app.state';
import { GetCartProductsList } from './core/store/actions/cart.actions';
import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { VideoChatComponent } from './video-chat/video-chat.component';
import { WebsocketService } from './shared/services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'codemarket';
  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    public dialog: MatDialog,
    private webSocketService: WebsocketService
  ) {

    const source = timer(0, 600000);

    const subscribe = source.subscribe(val => {
      this.authService.checkIfUserIsLoggedIn();
      console.log('===========================================================', val);
    });

    this.authService.loggedInUser$.pipe(
      tap((u) => {
        if (u) {
          this.webSocketService.subject.subscribe(async (d: any) => {
            console.log(d);
            if (d && d.userWhoIsCalling && !this.dialog.openDialogs.length) {
              this.openDialog(d.channel);
            }
          });

          this.store.dispatch(GetCartProductsList());
        }
      })
    ).subscribe();

  }

  openDialog(channel): void {
    const dialogRef = this.dialog.open(VideoChatComponent, {
      width: '550px',
      data: {isSomeoneCalling: true, channel},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
}


