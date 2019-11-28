import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { LoggingService } from '../logging.service';
import { Store } from '@ngrx/store';
import { AppState } from './shopping-list.reducer';
import { StartEdit } from './shopping-list.actions';

@Component({
	selector: 'app-shopping-list',
	templateUrl: './shopping-list.component.html',
	styleUrls: [ './shopping-list.component.css' ]
})
export class ShoppingListComponent implements OnInit, OnDestroy {
	ingredients: Observable<{ ingredients: Ingredient[] }>;
	private subscription: Subscription;

	constructor(
		private slService: ShoppingListService,
		private loggingService: LoggingService,
		private store: Store<AppState>
	) {}

	ngOnInit() {
		this.ingredients = this.store.select('shoppingList');
		// this.subscription = this.slService.ingredientsChanged.subscribe(
		// 	(ingredients: Ingredient[]) => {
		// 		this.ingredients = ingredients;
		// 	}
		// );

		this.loggingService.printLog(
			'Hello from ShoppingListComponent ngOnInit!'
		);
	}

	onEditItem(index: number) {
		this.store.dispatch(new StartEdit(index));
		//this.slService.startedEditing.next(index);
	}

	ngOnDestroy() {
		//this.subscription.unsubscribe();
	}
}
