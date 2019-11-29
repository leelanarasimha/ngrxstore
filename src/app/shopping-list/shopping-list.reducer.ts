import { Action } from '@ngrx/store';
import { Ingredient } from '../shared/ingredient.model';
import * as shoppingListActions from './shopping-list.actions';

export interface State {
	ingredients: Ingredient[];
	editedIngredient: Ingredient;
	editedIngredientIndex: number;
}

const initialState: State = {
	ingredients: [ new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10) ],
	editedIngredient: null,
	editedIngredientIndex: -1
};

export function ShoppingListReducer(
	state = initialState,
	action: shoppingListActions.shoppinglistActions
) {
	switch (action.type) {
		case shoppingListActions.ADD_INGREDIENT:
			return {
				...state,
				ingredients: [ ...state.ingredients, action.payload ]
			};
		case shoppingListActions.ADD_INGREDIENTS:
			return {
				...state,
				ingredients: [ ...state.ingredients, ...action.payload ]
			};

		case shoppingListActions.UPDATE_INGREDIENT:
			let ingredient = state.ingredients[state.editedIngredientIndex];
			let updatedIngredient = {
				...ingredient,
				...action.payload
			};

			let updatedIngredients = [ ...state.ingredients ];
			updatedIngredients[state.editedIngredientIndex] = updatedIngredient;
			return {
				...state,
				ingredients: updatedIngredients,
				editedIngredientIndex: -1,
				editedIngredient: null
			};
		case shoppingListActions.DELETE_INGREDIENT:
			return {
				...state,
				ingredients: state.ingredients.filter((ig, igIndex) => {
					return igIndex !== state.editedIngredientIndex;
				}),
				editedIngredientIndex: -1,
				editedIngredient: null
			};

		case shoppingListActions.START_EDIT:
			return {
				...state,
				editedIngredientIndex: action.payload,
				editedIngredient: { ...state.ingredients[action.payload] }
			};

		case shoppingListActions.STOP_EDIT:
			return {
				...state,
				editedIngredientIndex: -1,
				editedIngredient: null
			};

		default:
			return { ...state };
	}
}
