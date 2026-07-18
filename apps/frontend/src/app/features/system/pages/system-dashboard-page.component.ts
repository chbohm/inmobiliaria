import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-system-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './system-dashboard-page.component.html',
  styleUrl: './system-dashboard-page.component.scss'
})
export class SystemDashboardPageComponent {
  readonly cards = [
    ['Tenants', 'Alta y seguimiento de inmobiliarias administradas.'],
    ['Suscripciones', 'Planes, limites y estados de activacion.'],
    ['Auditoria', 'Trazabilidad de cambios del scope sistema.']
  ] as const;
}