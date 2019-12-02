import { Action } from '@ngrx/store';
import { Recipe } from '../recipe.model';

export const SET_RECIPES = '[Recipes] Set Recipes';
export const GET_RECIPES = '[Recipes] Get Recipes';

export class SetRecipes implements Action {
	readonly type = SET_RECIPES;
	constructor(public payload: Recipe[]) {}
}

export class GetRecipes implements Action {
	readonly type = GET_RECIPES;
}

export type RecipesActions = SetRecipes;
