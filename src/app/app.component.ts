import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth/auth.service';
import { LoggingService } from './logging.service';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.reducer';
import { AutoLogin } from './auth/store/auth.actions';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
	constructor(
		private authService: AuthService,
		private loggingService: LoggingService,
		private store: Store<AppState>
	) {}

	ngOnInit() {
		this.store.dispatch(new AutoLogin());

		this.loggingService.printLog('Hello from AppComponent ngOnInit');
	}
}
