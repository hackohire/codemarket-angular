import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { environment } from 'src/environments/environment';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../shared/auth.service';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ApolloModule,
    HttpClientModule,
    HttpLinkModule,
    MaterialModule
  ],
  providers: [
    AuthService
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
