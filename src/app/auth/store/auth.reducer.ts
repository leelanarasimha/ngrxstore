import { User } from '../user.model';
import { Action } from '@ngrx/store';

export interface State {
	user: User;
}

const initialState = {
	user: null
};

export function AuthReducer(state = initialState, action: Action) {
	switch (action.type) {
		default:
			return { ...state };
	}
}
