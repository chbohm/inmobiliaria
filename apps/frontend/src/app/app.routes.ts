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
			},
			{
				path: 'properties',
				loadComponent: () => import('./features/system/pages/system-properties-page.component').then((m) => m.SystemPropertiesPageComponent)
			},
			{
				path: 'tenants',
				loadComponent: () => import('./shared/pages/placeholder-page.component').then((m) => m.PlaceholderPageComponent),
				data: {
					section: 'Sistema',
					title: 'Administracion de tenants',
					description: 'Esta vista queda reservada para altas, estados y salud operativa de inmobiliarias administradas.'
				}
			},
			{
				path: 'profile',
				loadComponent: () => import('./shared/pages/placeholder-page.component').then((m) => m.PlaceholderPageComponent),
				data: {
					section: 'Sistema',
					title: 'Configuracion de usuario',
					description: 'Perfil, seguridad y preferencias del usuario logueado del scope sistema.'
				}
			},
			{
				path: 'settings',
				loadComponent: () => import('./shared/pages/placeholder-page.component').then((m) => m.PlaceholderPageComponent),
				data: {
					section: 'Sistema',
					title: 'Settings del sistema',
					description: 'Configuracion global de plataforma, permisos, auditoria y parametros compartidos.'
				}
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
			},
			{
				path: 'properties',
				loadComponent: () => import('./features/tenant/pages/tenant-properties-page.component').then((m) => m.TenantPropertiesPageComponent)
			},
			{
				path: 'contracts',
				loadComponent: () => import('./shared/pages/placeholder-page.component').then((m) => m.PlaceholderPageComponent),
				data: {
					section: 'Tenant',
					title: 'Contratos',
					description: 'Seccion lista para incorporar ciclo de vida de contratos, renovaciones y vencimientos.'
				}
			},
			{
				path: 'profile',
				loadComponent: () => import('./shared/pages/placeholder-page.component').then((m) => m.PlaceholderPageComponent),
				data: {
					section: 'Tenant',
					title: 'Configuracion de usuario',
					description: 'Gestion de perfil y preferencias personales del usuario autenticado en la inmobiliaria.'
				}
			},
			{
				path: 'settings',
				loadComponent: () => import('./shared/pages/placeholder-page.component').then((m) => m.PlaceholderPageComponent),
				data: {
					section: 'Tenant',
					title: 'Settings de la inmobiliaria',
					description: 'Configuracion operativa del tenant: moneda, politicas, branding y parametros comerciales.'
				}
			}
		]
	},
	{
		path: '**',
		redirectTo: 'login'
	}
];
