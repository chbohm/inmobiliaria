import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-placeholder-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="placeholder">
      <p class="eyebrow">{{ section }}</p>
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
    </section>
  `,
  styles: `
    .placeholder {
      border: 1px solid #2f3f4d;
      border-radius: 14px;
      background: rgba(20, 32, 44, 0.7);
      padding: 20px;
      color: #dde5ec;
      font-family: 'IBM Plex Sans', 'Segoe UI', sans-serif;
    }

    .eyebrow {
      margin: 0 0 8px;
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: #8aa1b5;
      font-weight: 700;
    }

    h2 {
      margin: 0;
      font-size: 1.3rem;
      color: #f7f9fb;
    }

    p {
      margin: 10px 0 0;
      color: #b4c2cf;
      max-width: 70ch;
    }
  `
})
export class PlaceholderPageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly section = this.route.snapshot.data['section'] ?? 'Proximamente';
  readonly title = this.route.snapshot.data['title'] ?? 'Seccion en preparacion';
  readonly description =
    this.route.snapshot.data['description'] ?? 'Esta area queda reservada para futuras funcionalidades.';
}