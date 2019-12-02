import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Recipe } from './recipe.model';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import { map, take } from 'rxjs/operators';
import { GetRecipes, SET_RECIPES } from './store/recipes.actions';
import { Actions, ofType } from '@ngrx/effects';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
	constructor(
		private store: Store<AppState>,
		private dataStorageService: DataStorageService,
		private actions$: Actions
	) {}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		this.store.dispatch(new GetRecipes());
		return this.actions$.pipe(ofType(SET_RECIPES), take(1));
	}
}
