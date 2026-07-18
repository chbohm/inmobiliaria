import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tenant-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tenant-dashboard-page.component.html',
  styleUrl: './tenant-dashboard-page.component.scss'
})
export class TenantDashboardPageComponent {
  readonly cards = [
    ['Inmuebles', 'Inventario operativo, estado comercial y mantenimiento.'],
    ['Contratos', 'Ciclo de alquiler, actualizaciones y vencimientos.'],
    ['Pagos', 'Seguimiento de pendientes, cobranzas y atrasos.']
  ] as const;
}