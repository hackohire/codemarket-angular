import { NgModule, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { environment } from 'src/environments/environment';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './store/effects/user.effects';
// import { StoreRouterConnectingModule } from '@ngrx/router-store';
// import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EPlatformActions } from './store/actions/app.actions';
import { ProductEffects } from './store/effects/product.effects';
import { CartEffects } from './store/effects/cart.effects';
import { AppState } from './store/state/app.state';
import { PostEffects } from './store/effects/post.effects';
import { appReducesrs } from './store/reducers/app.reducers';
import { SearchComponent } from './components/search/search.component';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStategy } from '../shared/services/custom_router_reuse';
import { AmplifyService } from 'aws-amplify-angular';


// Injected Token for actionreducermap or combinereducers for build error
export const REDUCER_TOKEN = new InjectionToken<ActionReducerMap<AppState>>('root reducer');

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
    SearchComponent
  ],
  imports: [
    CommonModule,
    ApolloModule,
    HttpClientModule,
    HttpLinkModule,
    StoreModule.forRoot(REDUCER_TOKEN, { metaReducers: [clearState] }),
    EffectsModule.forRoot(
      [
        UserEffects,
        ProductEffects,
        CartEffects,
        PostEffects
      ]),
    // StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
    // StoreDevtoolsModule.instrument(),
  ],
  providers: [
    AmplifyService,
    {
      provide: REDUCER_TOKEN,
      useValue: appReducesrs()
    },
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStategy },
  ],
  entryComponents: [
    SearchComponent
  ]
})
export class CoreModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {
    // Apollo Server Configuration
    const httpCodemarket = httpLink.create({ uri: environment.graphql_url });
    // const httpPlatform = httpLink.create({ uri: environment.platform_graphql_url });

    let token = '';

    // cleanTypeName to omit __typename field
    const cleanTypeName = new ApolloLink((operation, forward) => {
      if (operation.variables) {
        const omitTypename = (key, value) => {
          /** Omit __typename field otherwise GraphQL will gi erro
           * Omit _id field if it is empty
           */
          if (key === '__typename' || (key === '_id' && !value)) {
            return undefined
          } 
          return value;
        }
        operation.variables = JSON.parse(JSON.stringify(operation.variables), omitTypename);
      }
      return forward(operation).map((data) => {
        return data;
      });
    });


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
      link: authLink.concat(cleanTypeName).concat(httpCodemarket),
      cache: new InMemoryCache({
        addTypename: true,

        /*
          Whenever Schema gets changed for Product, Help, Interview and Requirements => "description" field
          Resolver also has to be changed accordingly
        */
        fragmentMatcher: new IntrospectionFragmentMatcher({
          introspectionQueryResultData: {
            __schema: {
              types: [
                {
                  kind: 'UNION',
                  name: 'descriptionBlocks',
                  possibleTypes: [
                    { name: 'HeaderBlock' },
                    { name: 'ParagraphBlock' },
                    { name: 'CodeBlock' },
                    { name: 'ImageBlock' },
                    { name: 'ListBlock' },
                    { name: 'QuoteBlock' },
                    { name: 'TableBlock' },
                    { name: 'WarningBlock' },
                    { name: 'EmbedBlock' }
                  ],
                },
              ],
            },
          },
        })
      }),

    });
    /** Codemarket Apollo Client ends here */

    /** Platform Apollo Client */
    // apollo.createNamed(
    //   'platform',
    //   {
    //   link: authLink.concat(httpPlatform),
    //   cache: new InMemoryCache({
    //     addTypename: false
    //   }),
    // });
    /** Platform Apollo Client ends here */
  }
}
