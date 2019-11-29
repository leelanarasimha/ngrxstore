import * as ShoppinglistReducer from '../shopping-list/shopping-list.reducer';
import * as AuthReducer from '../auth/store/auth.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
	shoppingList: ShoppinglistReducer.State;
	auth: AuthReducer.State;
}

export const actionReducerMap: ActionReducerMap<AppState> = {
	shoppingList: ShoppinglistReducer.ShoppingListReducer,
	auth: AuthReducer.AuthReducer
};
