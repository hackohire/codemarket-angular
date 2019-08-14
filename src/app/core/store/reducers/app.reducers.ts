import { ActionReducerMap } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { routerReducer } from '@ngrx/router-store';
import { userReducers } from './user.reducers';
import { productReducers } from './product.reducers';
import { helpReducers } from './help.reducers';
import { cartReducers } from './cart.reducers';
import { interviewReducers } from './interview.reducers';
import { requirementReducers } from './requirement.reducers';

export function appReducesrs(): ActionReducerMap<AppState, any> {
    return {
        router: routerReducer,
        users: userReducers,
        products: productReducers,
        queries: helpReducers,
        cart: cartReducers,
        interview: interviewReducers,
        requirement: requirementReducers
    };
}

