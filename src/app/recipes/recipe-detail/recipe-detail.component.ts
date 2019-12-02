import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { map, switchMap } from 'rxjs/operators';

@Component({
	selector: 'app-recipe-detail',
	templateUrl: './recipe-detail.component.html',
	styleUrls: [ './recipe-detail.component.css' ]
})
export class RecipeDetailComponent implements OnInit {
	recipe: Recipe;
	id: number;

	constructor(
		private recipeService: RecipeService,
		private route: ActivatedRoute,
		private store: Store<AppState>,
		private router: Router
	) {}

	ngOnInit() {
		this.route.params
			.pipe(
				map((params: Params) => {
					return +params['id'];
				}),
				switchMap((id) => {
					this.id = id;
					return this.store.select('recipes');
				}),
				map((recipesData) => {
					return recipesData.recipes.find((recipe, index) => {
						return index === this.id;
					});
				})
			)
			.subscribe((recipe: Recipe) => {
				this.recipe = recipe;
			});

		// this.route.params.subscribe((params: Params) => {
		// 	this.id = +params['id'];
		// 	this.store
		// 		.select('recipes')
		// 		.pipe(
		// 			map((recipesData) => {
		// 				return recipesData.recipes.find((recipe) => {
		// 					return recipe.id === this.id;
		// 				});
		// 			})
		// 		)
		// 		.subscribe((recipe) => {
		// 			this.recipe = recipe;
		// 		});
		// 	//this.recipe = this.recipeService.getRecipe(this.id);
		// });
	}

	onAddToShoppingList() {
		this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
	}

	onEditRecipe() {
		this.router.navigate([ 'edit' ], { relativeTo: this.route });
		// this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
	}

	onDeleteRecipe() {
		this.recipeService.deleteRecipe(this.id);
		this.router.navigate([ '/recipes' ]);
	}
}
