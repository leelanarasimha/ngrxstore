import { Component, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import { AuthenticateStart, SignupStart } from './store/auth.actions';

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {
	isLoginMode = true;
	isLoading = false;
	error: string = null;
	@ViewChild(PlaceholderDirective, { static: false })
	alertHost: PlaceholderDirective;

	private closeSub: Subscription;
	private storeSub: Subscription;

	ngOnInit() {
		this.storeSub = this.store.select('auth').subscribe((authState) => {
			this.isLoading = authState.isLoading;
			this.error = authState.error;
			if (this.error) {
				this.showErrorAlert(this.error);
			}
		});
	}

	constructor(
		private router: Router,
		private componentFactoryResolver: ComponentFactoryResolver,
		private store: Store<AppState>
	) {}

	onSwitchMode() {
		this.isLoginMode = !this.isLoginMode;
	}

	onSubmit(form: NgForm) {
		if (!form.valid) {
			return;
		}
		const email = form.value.email;
		const password = form.value.password;

		this.isLoading = true;

		if (this.isLoginMode) {
			//authObs = this.authService.login(email, password);
			this.store.dispatch(new AuthenticateStart({ email, password }));
		} else {
			this.store.dispatch(new SignupStart({ email, password }));
		}

		form.reset();
	}

	ngOnDestroy() {
		if (this.closeSub) {
			this.closeSub.unsubscribe();
		}

		if (this.storeSub) {
			this.storeSub.unsubscribe();
		}
	}

	private showErrorAlert(message: string) {
		// const alertCmp = new AlertComponent();
		const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
			AlertComponent
		);
		const hostViewContainerRef = this.alertHost.viewContainerRef;
		hostViewContainerRef.clear();

		const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

		componentRef.instance.message = message;
		this.closeSub = componentRef.instance.close.subscribe(() => {
			this.closeSub.unsubscribe();
			hostViewContainerRef.clear();
		});
	}
}
