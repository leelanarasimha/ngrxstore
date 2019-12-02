import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import { Logout } from './store/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {
	private tokenExpirationTimer: any;

	constructor(private store: Store<AppState>) {}

	logout() {
		this.store.dispatch(new Logout());
	}

	clearLogoutTimer() {
		if (this.tokenExpirationTimer) {
			clearTimeout(this.tokenExpirationTimer);
		}
		this.tokenExpirationTimer = null;
	}

	autoLogout(expirationDuration: number) {
		this.tokenExpirationTimer = setTimeout(() => {
			this.store.dispatch(new Logout());
		}, expirationDuration);
	}
}
