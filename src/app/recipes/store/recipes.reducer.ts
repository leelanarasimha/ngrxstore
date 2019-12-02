import { Recipe } from '../recipe.model';
import { RecipesActions, SET_RECIPES } from './recipes.actions';

export interface State {
	recipes: Recipe[];
}

const initialState = {
	recipes: []
};

export function RecipesReducer(state = initialState, action: RecipesActions) {
	switch (action.type) {
		case SET_RECIPES:
			return {
				...state,
				recipes: [ ...action.payload ]
			};
		default:
			return { ...state };
	}
}
