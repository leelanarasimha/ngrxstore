import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { map } from 'rxjs/operators';

@Component({
	selector: 'app-recipe-list',
	templateUrl: './recipe-list.component.html',
	styleUrls: [ './recipe-list.component.css' ]
})
export class RecipeListComponent implements OnInit, OnDestroy {
	recipes: Recipe[];
	subscription: Subscription;

	constructor(
		private router: Router,
		private store: Store<AppState>,
		private route: ActivatedRoute
	) {}

	ngOnInit() {
		this.subscription = this.store
			.select('recipes')
			.pipe(
				map((recipesData) => {
					return recipesData.recipes;
				})
			)
			.subscribe((recipes: Recipe[]) => {
				this.recipes = recipes;
			});
	}

	onNewRecipe() {
		this.router.navigate([ 'new' ], { relativeTo: this.route });
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
