import { Actions, Effect, ofType } from '@ngrx/effects';
import { GET_RECIPES, SetRecipes } from './recipes.actions';
import { switchMap, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '../recipe.model';

@Injectable()
export class RecipesEffects {
	@Effect()
	getRecipes = this.actions$.pipe(
		ofType(GET_RECIPES),
		switchMap(() => {
			return this.http
				.get<Recipe[]>('https://recipe-project-460d0.firebaseio.com/categories.json')
				.pipe(
					map((recipes) => {
						return recipes.map((recipe) => {
							return {
								...recipe,
								ingredients: recipe.ingredients ? recipe.ingredients : []
							};
						});
					}),
					tap((recipes) => {
						new SetRecipes(recipes);
					})
				);
		})
	);
	constructor(public actions$: Actions, private http: HttpClient) {}
}
