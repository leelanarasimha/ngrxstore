import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';
import { LoggingService } from './logging.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ShoppingListReducer } from './shopping-list/shopping-list.reducer';
import { actionReducerMap } from './store/app.reducer';
import { AuthEffects } from './auth/store/auth.effects';

@NgModule({
	declarations: [ AppComponent, HeaderComponent ],
	imports: [
		BrowserModule,
		HttpClientModule,
		AppRoutingModule,
		StoreModule.forRoot(actionReducerMap),
		EffectsModule.forRoot([ AuthEffects ]),
		SharedModule,
		CoreModule
	],
	bootstrap: [ AppComponent ]
	// providers: [LoggingService]
})
export class AppModule {}
