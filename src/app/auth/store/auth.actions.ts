import { Action } from '@ngrx/store';

export const AUTHENTICATE_SUCCESS = 'authenticate success';
export const LOGOUT = 'LOGOUT';
export const AUTHENTICATE_START = '[Auth] Authenticate Start';
export const SIGNUP_START = '[Auth] Signup Start';
export const AUTO_LOGIN = '[Auth] Auto Login';
export const LOGIN_FAIL = '[Auth] Login Fail';

export class AuthenticateSuccess implements Action {
	readonly type = AUTHENTICATE_SUCCESS;

	constructor(
		public payload: { email: string; userId: string; token: string; expirationDate: Date }
	) {}
}

export class Logout implements Action {
	readonly type = LOGOUT;
}

export class AuthenticateStart implements Action {
	readonly type = AUTHENTICATE_START;
	constructor(public payload: { email: string; password: string }) {}
}

export class LoginFail implements Action {
	readonly type = LOGIN_FAIL;
	constructor(public payload: string) {}
}

export class SignupStart implements Action {
	readonly type = SIGNUP_START;
	constructor(public payload: { email: string; password: string }) {}
}

export class AutoLogin implements Action {
	readonly type = AUTO_LOGIN;
}

export type AuthActions =
	| AuthenticateSuccess
	| Logout
	| AuthenticateStart
	| LoginFail
	| AutoLogin
	| SignupStart;
