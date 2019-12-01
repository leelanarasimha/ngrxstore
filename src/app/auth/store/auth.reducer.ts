import { User } from '../user.model';
import {
	AuthActions,
	LOGOUT,
	LOGIN_FAIL,
	AUTHENTICATE_SUCCESS,
	AUTHENTICATE_START,
	SIGNUP_START
} from './auth.actions';

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
		case AUTHENTICATE_SUCCESS:
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

		case SIGNUP_START:
			return {
				...state,
				isLoading: true,
				error: null
			};

		case AUTHENTICATE_START:
			return {
				...state,
				isLoading: true,
				error: null
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
				error: null,
				user: null
			};

		default:
			return { ...state };
	}
}
