import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { environment } from 'src/environments/environment';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { appReducesrs } from './store/reducers/app.reducers';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './store/effects/user.effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EPlatformActions } from './store/actions/app.actions';
import { ProductEffects } from './store/effects/product.effects';
import { HelpEffects } from './store/effects/help.effects';

export function clearState(reducer) {
  return (state, action) => {

    if (action.type === EPlatformActions.ResetPlatFormState) {
      state = undefined;
    }

    return reducer(state, action);
  };
}

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ApolloModule,
    HttpClientModule,
    HttpLinkModule,
    StoreModule.forRoot(appReducesrs(), { metaReducers: [clearState] }),
    EffectsModule.forRoot([UserEffects, ProductEffects, HelpEffects]),
    StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
    StoreDevtoolsModule.instrument(),
  ],
  providers: [
  ]
})
export class CoreModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {
    // Apollo Server Configuration
    const httpCodemarket = httpLink.create({ uri: environment.graphql_url });
    const httpPlatform = httpLink.create({ uri: environment.platform_graphql_url });

    let token = '';
    const authLink = new ApolloLink((operation, forward) => {


      // Get the authentication token from local storage if it exists
      token = localStorage.getItem('idToken');

      // Use the setContext method to set the HTTP headers.
      operation.setContext({
        headers: {
          Authorization: token ? token : ''
        }
      });
      // Call the next link in the middleware chain.
      return forward(operation);
    });

    /** Codemarket Apollo Client */
    apollo.create({
      link: authLink.concat(httpCodemarket),
      cache: new InMemoryCache({
        addTypename: false
      }),
    });
    /** Codemarket Apollo Client ends here */

    /** Platform Apollo Client */
    apollo.createNamed(
      'platform',
      {
      link: authLink.concat(httpPlatform),
      cache: new InMemoryCache({
        addTypename: false
      }),
    });
    /** Platform Apollo Client ends here */
  }
}
