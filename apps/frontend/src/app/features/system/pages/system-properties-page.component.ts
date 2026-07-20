import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import type { Inmueble } from '@inmobiliaria/contracts';

const NOW = new Date().toISOString();

const SYSTEM_SAMPLE_ITEMS: Inmueble[] = [
  {
    idInmueble: '11e6262e-3e0c-47a0-9553-7a8d78585821',
    idInmobiliaria: '33c25cbe-a847-47c7-9177-7cc237b634e4',
    tipo: 'CASA',
    estado: 'DISPONIBLE',
    descripcionInterna: 'Inmueble de referencia para tablero sistema.',
    descripcionPublica: 'Casa de 3 ambientes con patio.',
    direccion: 'Av. Siempre Viva 123',
    ciudad: 'Rosario',
    provincia: 'Santa Fe',
    superficies: {
      cubierta: 110,
      descubierta: 40,
      total: 150
    },
    banios: 2,
    idDuenio: '11111111-1111-4111-8111-111111111111',
    contratos: ['55555555-5555-4555-8555-555555555555'],
    pagos: [],
    comentarios: [],
    attachments: [],
    createdAt: NOW,
    updatedAt: NOW
  },
  {
    idInmueble: '77e6262e-3e0c-47a0-9553-7a8d78585824',
    idInmobiliaria: '33c25cbe-a847-47c7-9177-7cc237b634e4',
    tipo: 'DEPARTAMENTO',
    estado: 'ALQUILADO',
    descripcionInterna: 'Unidad con contrato vigente.',
    descripcionPublica: 'Departamento centrico de 2 ambientes.',
    direccion: 'San Martin 540',
    ciudad: 'Cordoba',
    provincia: 'Cordoba',
    superficies: {
      cubierta: 58,
      descubierta: 6,
      total: 64
    },
    banios: 1,
    idDuenio: '22222222-2222-4222-8222-222222222222',
    contratos: ['66666666-6666-4666-8666-666666666666'],
    pagos: [],
    comentarios: [],
    attachments: [],
    createdAt: NOW,
    updatedAt: NOW
  }
];

@Component({
  selector: 'app-system-properties-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './system-properties-page.component.html',
  styleUrl: './system-properties-page.component.scss'
})
export class SystemPropertiesPageComponent {
  readonly items = signal<Inmueble[]>(SYSTEM_SAMPLE_ITEMS);
  readonly saveMessage = signal<string | null>(null);

  searchText = '';
  statusFilter: 'ALL' | Inmueble['estado'] = 'ALL';
  selectedId: string | null | undefined = null;
  newContractId = '';
  draft: Inmueble | null = null;

  public get filteredItems(): Inmueble[] {
    const query = this.searchText.trim().toLowerCase();

    return this.items().filter((item) => {
      const passesStatus = this.statusFilter === 'ALL' || item.estado === this.statusFilter;
      const text = `${item.direccion} ${item.ciudad} ${item.provincia} ${item.tipo}`.toLowerCase();
      const passesSearch = query.length === 0 || text.includes(query);
      return passesStatus && passesSearch;
    });
  }

  public selectItem(item: Inmueble): void {
    this.selectedId = item.idInmueble;
    this.newContractId = '';
    this.draft = this.clone(item);
    this.saveMessage.set(null);
  }

  public isSelected(item: Inmueble): boolean {
    return this.selectedId === item.idInmueble;
  }

  public resetDraft(): void {
    const selected = this.items().find((item) => item.idInmueble === this.selectedId);
    if (!selected) {
      return;
    }

    this.draft = this.clone(selected);
    this.saveMessage.set('Cambios descartados.');
  }

  public saveDraft(): void {
    if (!this.draft) {
      return;
    }

    const updated = { ...this.draft, updatedAt: new Date().toISOString() };
    this.items.update((items) => items.map((item) => (item.idInmueble === updated.idInmueble ? updated : item)));
    this.draft = this.clone(updated);
    this.saveMessage.set('Detalle actualizado en modo sistema.');
  }

  public addContract(): void {
    if (!this.draft) {
      return;
    }

    const value = this.newContractId.trim();
    const currentContracts = this.draft.contratos ?? [];

    if (!value) {
      return;
    }

    if (!currentContracts.includes(value)) {
      this.draft = {
        ...this.draft,
        contratos: [...currentContracts, value]
      };
      this.saveMessage.set('Contrato agregado al borrador.');
    }

    this.newContractId = '';
  }

  private clone(item: Inmueble): Inmueble {
    return {
      ...item,
      superficies: {
        cubierta: item.superficies?.cubierta ?? 0,
        descubierta: item.superficies?.descubierta ?? 0,
        total: item.superficies?.total ?? 0
      },
      contratos: [...(item.contratos ?? [])],
      pagos: [...(item.pagos ?? [])],
      comentarios: [...(item.comentarios ?? [])],
      attachments: [...(item.attachments ?? [])]
    };
  }

  public updateTotalSurface(value: number): void {
    if (!this.draft) {
      return;
    }

    const total = Number(value) || 0;
    this.draft = {
      ...this.draft,
      superficies: {
        cubierta: this.draft.superficies?.cubierta ?? 0,
        descubierta: this.draft.superficies?.descubierta ?? 0,
        total
      }
    };
  }
}