import { Routes } from '@angular/router';

import { authGuard, guestGuard, systemGuard, tenantGuard } from './core/auth/auth.guards';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'login'
	},
	{
		path: 'login',
		canActivate: [guestGuard],
		loadComponent: () => import('./features/auth/pages/login-page.component').then((m) => m.LoginPageComponent)
	},
	{
		path: 'system',
		canActivate: [authGuard, systemGuard],
		loadComponent: () => import('./features/system/layouts/system-layout.component').then((m) => m.SystemLayoutComponent),
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'dashboard'
			},
			{
				path: 'dashboard',
				loadComponent: () => import('./features/system/pages/system-dashboard-page.component').then((m) => m.SystemDashboardPageComponent)
			}
		]
	},
	{
		path: 'tenant',
		canActivate: [authGuard, tenantGuard],
		loadComponent: () => import('./features/tenant/layouts/tenant-layout.component').then((m) => m.TenantLayoutComponent),
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'dashboard'
			},
			{
				path: 'dashboard',
				loadComponent: () => import('./features/tenant/pages/tenant-dashboard-page.component').then((m) => m.TenantDashboardPageComponent)
			}
		]
	},
	{
		path: '**',
		redirectTo: 'login'
	}
];
