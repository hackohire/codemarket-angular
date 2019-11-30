// tslint:disable
/*
 * Copyright 2017-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */
// tslint:enable

import {
	Component,
	Input,
	OnInit,
	ViewChild,
	ComponentFactoryResolver,
	OnDestroy,
} from '@angular/core';
import { DynamicComponentDirective } from '../directives/dynamic.component.directive';
import { ComponentMount } from '../component.mount';
import { SignUpClass } from './sign-up.class';
import { SignUpComponentCore } from './sign-up.component.core';
import { AuthState } from 'aws-amplify-angular/dist/src/providers/auth.state';

@Component({
	selector: 'amplify-auth-sign-up',
	template: `
		<div>
			<ng-template component-host></ng-template>
		</div>
	`,
})
export class SignUpComponent implements OnInit, OnDestroy {
	@Input() framework: string;
	@Input() authState: AuthState;
	@Input() signUpConfig: any;
	@Input() usernameAttributes: string = 'username';
	@Input() hide: string[] = [];
	@ViewChild(DynamicComponentDirective, {static: true})
	componentHost: DynamicComponentDirective;

	constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

	ngOnInit() {
		this.loadComponent();
	}

	ngOnDestroy() {}

	loadComponent() {
		const authComponent = new ComponentMount(SignUpComponentCore, {
						authState: this.authState,
						signUpConfig: this.signUpConfig,
						usernameAttributes: this.usernameAttributes,
						hide: this.hide,
				  });

		const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
			authComponent.component
		);

		const viewContainerRef = this.componentHost.viewContainerRef;
		viewContainerRef.clear();

		const componentRef = viewContainerRef.createComponent(componentFactory);
		(<SignUpClass>componentRef.instance).data = authComponent.data;
	}
}
