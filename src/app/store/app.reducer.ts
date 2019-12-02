import * as ShoppinglistReducer from '../shopping-list/shopping-list.reducer';
import * as AuthReducer from '../auth/store/auth.reducer';
import * as RecipesReducer from '../recipes/store/recipes.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
	shoppingList: ShoppinglistReducer.State;
	auth: AuthReducer.State;
	recipes: RecipesReducer.State;
}

export const actionReducerMap: ActionReducerMap<AppState> = {
	shoppingList: ShoppinglistReducer.ShoppingListReducer,
	auth: AuthReducer.AuthReducer,
	recipes: RecipesReducer.RecipesReducer
};
