import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { Store } from '@ngrx/store';
import { AddIngredient, UpdateIngredient, DeleteIngredient } from '../shopping-list.actions';
import { AppState } from 'src/app/store/app.reducer';

@Component({
	selector: 'app-shopping-edit',
	templateUrl: './shopping-edit.component.html',
	styleUrls: [ './shopping-edit.component.css' ]
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
	@ViewChild('f', { static: false })
	slForm: NgForm;
	subscription: Subscription;
	editMode = false;
	editedItemIndex: number;
	editedItem: Ingredient;

	constructor(private slService: ShoppingListService, private store: Store<AppState>) {}

	ngOnInit() {
		this.subscription = this.store.select('shoppingList').subscribe((statedata) => {
			if (statedata.editedIngredientIndex > -1) {
				this.editMode = true;
				this.editedItem = statedata.editedIngredient;
				this.slForm.setValue({
					name: this.editedItem.name,
					amount: this.editedItem.amount
				});
			} else {
				this.editMode = false;
			}
		});

		// this.slService.startedEditing.subscribe((index: number) => {
		// 	this.editedItemIndex = index;
		// 	this.editMode = true;
		// 	this.editedItem = this.slService.getIngredient(index);
		// 	this.slForm.setValue({
		// 		name: this.editedItem.name,
		// 		amount: this.editedItem.amount
		// 	});
		// });
	}

	onSubmit(form: NgForm) {
		const value = form.value;
		const newIngredient = new Ingredient(value.name, value.amount);
		if (this.editMode) {
			this.store.dispatch(new UpdateIngredient(newIngredient));
			// this.slService.updateIngredient(
			// 	this.editedItemIndex,
			// 	newIngredient
			// );
		} else {
			this.store.dispatch(new AddIngredient(newIngredient));
		}
		this.editMode = false;
		form.reset();
	}

	onClear() {
		this.slForm.reset();
		this.editMode = false;
	}

	onDelete() {
		this.store.dispatch(new DeleteIngredient());
		//this.slService.deleteIngredient(this.editedItemIndex);
		this.onClear();
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
