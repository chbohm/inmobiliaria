import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import type { AuthenticatedUser, LoginRequest } from '@inmobiliaria/contracts';

type SurfaceCard = {
  eyebrow: string;
  title: string;
  body: string;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly title = 'Inmobiliaria SaaS';

  readonly surfaces: SurfaceCard[] = [
    {
      eyebrow: 'Sistema',
      title: 'Backoffice multi-tenant',
      body: 'Alta de inmobiliarias, bootstrap inicial y gestion de sesiones de super usuario.'
    },
    {
      eyebrow: 'Tenant',
      title: 'Operacion diaria',
      body: 'Inmuebles, contratos, pagos y tareas con permisos y auditoria por inmobiliaria.'
    },
    {
      eyebrow: 'Contratos',
      title: 'Tipos compartidos',
      body: 'Frontend y backend consumen el mismo paquete `@inmobiliaria/contracts`.'
    }
  ];

  readonly demoLogin: LoginRequest = {
    email: 'admin@local.test',
    password: 'changeit123'
  };

  readonly demoUser: AuthenticatedUser = {
    id: '11111111-1111-4111-8111-111111111111',
    email: 'admin@local.test',
    role: 'SUPER_ADMIN',
    scope: 'SYSTEM'
  };

  readonly demoLoginJson = JSON.stringify(this.demoLogin, null, 2);
  readonly demoUserJson = JSON.stringify(this.demoUser, null, 2);
}
