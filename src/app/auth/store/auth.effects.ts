import { Actions, ofType, Effect } from '@ngrx/effects';
import {
	LoginFail,
	AUTHENTICATE_START,
	AuthenticateStart,
	AuthenticateSuccess,
	AUTHENTICATE_SUCCESS,
	SIGNUP_START,
	SignupStart,
	LOGOUT,
	AUTO_LOGIN
} from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

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
					tap((resData) => {
						this.authService.autoLogout(+resData.expiresIn * 1000);
					}),
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
	authRedirect = this.actions$.pipe(
		ofType(AUTHENTICATE_SUCCESS),
		tap((response) => {
			this.router.navigate([ '/' ]);
		})
	);

	@Effect({ dispatch: false })
	authLogout = this.actions$.pipe(
		ofType(LOGOUT),
		tap(() => {
			this.authService.clearLogoutTimer();
			localStorage.removeItem('userData');
			this.router.navigate([ '/auth' ]);
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
					tap((resData) => {
						this.authService.autoLogout(+resData.expiresIn * 1000);
					}),
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

	@Effect()
	autoLogin = this.actions$.pipe(
		ofType(AUTO_LOGIN),
		map((response) => {
			const userData: {
				email: string;
				id: string;
				_token: string;
				_tokenExpirationDate: string;
			} = JSON.parse(localStorage.getItem('userData'));
			if (!userData) {
				return { type: 'DUMMY' };
			}

			const loadedUser = new User(
				userData.email,
				userData.id,
				userData._token,
				new Date(userData._tokenExpirationDate)
			);

			if (loadedUser.token) {
				//this.user.next(loadedUser);
				const expirationDuration =
					new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();

				this.authService.autoLogout(expirationDuration);
				return new AuthenticateSuccess({
					email: loadedUser.email,
					userId: loadedUser.id,
					token: loadedUser.token,
					expirationDate: new Date(userData._tokenExpirationDate)
				});

				// const expirationDuration =
				// 	new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
				// this.autoLogout(expirationDuration);
			}
			return { type: 'DUMMY' };
		})
	);

	handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
		const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

		const user = new User(email, userId, token, expirationDate);
		localStorage.setItem('userData', JSON.stringify(user));

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

	constructor(
		private actions$: Actions,
		private http: HttpClient,
		private router: Router,
		private authService: AuthService
	) {}
}
