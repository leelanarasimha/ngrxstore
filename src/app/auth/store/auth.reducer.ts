import { User } from '../user.model';
import { AuthActions, LOGIN, LOGOUT, LOGIN_FAIL } from './auth.actions';

export interface State {
	user: User;
	error: string;
	isLoading: boolean;
}

const initialState = {
	user: null,
	error: null,
	isLoading: false
};

export function AuthReducer(state = initialState, action: AuthActions) {
	switch (action.type) {
		case LOGIN:
			let user = new User(
				action.payload.email,
				action.payload.userId,
				action.payload.token,
				action.payload.expirationDate
			);

			return {
				...state,
				isLoading: false,
				error: null,
				user
			};

		case LOGIN_FAIL:
			return {
				...state,
				isLoading: false,
				error: action.payload
			};

		case LOGOUT:
			return {
				...state,
				user: null
			};

		default:
			return { ...state };
	}
}
