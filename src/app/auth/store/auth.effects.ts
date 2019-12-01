import { Actions, ofType, Effect } from '@ngrx/effects';
import {
	LoginFail,
	AUTHENTICATE_START,
	AuthenticateStart,
	AuthenticateSuccess,
	AUTHENTICATE_SUCCESS,
	SIGNUP_START,
	SignupStart
} from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface AuthResponseData {
	kind: string;
	idToken: string;
	email: string;
	refreshToken: string;
	expiresIn: string;
	localId: string;
	registered?: boolean;
}

@Injectable()
export class AuthEffects {
	@Effect()
	authLogin = this.actions$.pipe(
		ofType(AUTHENTICATE_START),
		switchMap((authData: AuthenticateStart) => {
			return this.http
				.post<
					AuthResponseData
				>(
					'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' +
						environment.firebaseAPIKey,
					{
						email: authData.payload.email,
						password: authData.payload.password,
						returnSecureToken: true
					}
				)
				.pipe(
					map((resData) => {
						return this.handleAuthentication(
							+resData.expiresIn,
							resData.email,
							resData.localId,
							resData.idToken
						);
					}),
					catchError((errorRes: HttpErrorResponse) => {
						return this.handleError(errorRes);
					})
				);
		})
	);

	@Effect({ dispatch: false })
	authSuccess = this.actions$.pipe(
		ofType(AUTHENTICATE_SUCCESS),
		tap((response) => {
			this.router.navigate([ '/' ]);
		})
	);

	@Effect()
	authSignUp = this.actions$.pipe(
		ofType(SIGNUP_START),
		switchMap((authData: SignupStart) => {
			return this.http
				.post<
					AuthResponseData
				>(
					'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' +
						environment.firebaseAPIKey,
					{
						email: authData.payload.email,
						password: authData.payload.password,
						returnSecureToken: true
					}
				)
				.pipe(
					map((resData) => {
						return this.handleAuthentication(
							+resData.expiresIn,
							resData.email,
							resData.localId,
							resData.idToken
						);
					}),
					catchError((error) => {
						return this.handleError(error);
					})
				);
		})
	);

	handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
		const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

		return new AuthenticateSuccess({
			email: email,
			userId: userId,
			token: token,
			expirationDate: expirationDate
		});
	};

	handleError = (errorRes: any) => {
		let errorMessage = 'An unknown error occurred!';
		if (!errorRes.error || !errorRes.error.error) {
			return of(new LoginFail(errorMessage));
		}
		switch (errorRes.error.error.message) {
			case 'EMAIL_EXISTS':
				errorMessage = 'This email exists already';
				break;
			case 'EMAIL_NOT_FOUND':
				errorMessage = 'This email does not exist.';
				break;
			case 'INVALID_PASSWORD':
				errorMessage = 'This password is not correct.';
				break;
		}
		return of(new LoginFail(errorMessage));
	};

	constructor(private actions$: Actions, private http: HttpClient, private router: Router) {}
}
