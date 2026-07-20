import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface WorkbenchNavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-workbench-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './workbench-shell.component.html',
  styleUrl: './workbench-shell.component.scss'
})
export class WorkbenchShellComponent {
  readonly contextLabel = input.required<string>();
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
  readonly userPrimary = input<string>('Sin sesion');
  readonly userSecondary = input<string>('');
  readonly primaryNav = input<WorkbenchNavItem[]>([]);
  readonly secondaryNav = input<WorkbenchNavItem[]>([]);

  readonly logoutRequested = output<void>();

  public requestLogout(): void {
    this.logoutRequested.emit();
  }
}