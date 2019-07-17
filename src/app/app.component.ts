import { Component } from '@angular/core';
import Amplify, { Hub, Auth } from 'aws-amplify';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'codemarket';
  loggedInUser: any;
  constructor(private auth: AuthService) {
    // Hub.listen('auth', (data) => {
    //   const { channel, payload } = data;
    //   const state = {
    //     state: payload.event,
    //     user: payload.data
    //   };
    //   console.log('Hub', data);
    //   if (channel === 'auth') {
    //     Auth.currentAuthenticatedUser()
    //       .then(data => this.loggedInUser = data)
    //       .catch(err => console.log(err));
    //     // this.amplifyService.authState().next(state);
    //   }
    // });
    // Auth.currentUserPoolUser()
    // .then(data => this.loggedInUser = data)
    // .catch(err => console.log(err));
  }

  login() {
    const config = Amplify.Auth._config;
    const oauth = Amplify.Auth._config.oauth;
    const url = `${environment.COGNITO_AUTH_DOMAIN}/login?response_type=${oauth.responseType}&client_id=${config.aws_user_pools_web_client_id}&redirect_uri=${oauth.redirectSignIn}`;
    // console.log(Amplify.Auth._config);
    window.location.assign(url);
  }
}


