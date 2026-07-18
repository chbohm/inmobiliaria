import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { LoginRequestSchema, type LoginRequest } from '@inmobiliaria/contracts';

import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.formBuilder.nonNullable.group({
    scope: this.formBuilder.nonNullable.control<'SYSTEM' | 'TENANT'>('SYSTEM'),
    email: this.formBuilder.nonNullable.control('admin@local.test', [Validators.required, Validators.email]),
    password: this.formBuilder.nonNullable.control('changeit123', [Validators.required, Validators.minLength(8)]),
    inmobiliariaId: this.formBuilder.nonNullable.control('')
  });

  get needsTenantId(): boolean {
    return this.form.controls.scope.value === 'TENANT';
  }

  public submit(): void {
    this.errorMessage.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload: LoginRequest = {
      email: raw.email,
      password: raw.password,
      inmobiliariaId: raw.scope === 'TENANT' && raw.inmobiliariaId ? raw.inmobiliariaId : undefined
    };

    const parsed = LoginRequestSchema.safeParse(payload);
    if (!parsed.success) {
      this.errorMessage.set('Los datos del formulario no cumplen con el contrato compartido.');
      return;
    }

    this.isSubmitting.set(true);
    this.authService.login(parsed.data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.isSubmitting.set(false);
      },
      error: (error: unknown) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(this.resolveErrorMessage(error));
      }
    });
  }

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      return error.error?.message ?? 'No fue posible iniciar sesion.';
    }

    return 'No fue posible iniciar sesion.';
  }
}