import { z } from 'zod';

import {
  EstadoInmuebleSchema,
  InmuebleSchema,
  PlanSuscripcionSchema,
  ScopeSchema,
  UUIDSchema
} from './domain';

export const ApiSuccessSchema = z.object({
  success: z.literal(true)
});

export const ApiErrorSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  code: z.string()
});

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const RefreshRequestSchema = z.object({
  refreshToken: z.string().min(1)
});

export const AuthenticatedUserSchema = z.object({
  id: UUIDSchema,
  email: z.string().email(),
  role: z.string(),
  scope: ScopeSchema,
  inmobiliariaId: UUIDSchema.optional()
});

export const AuthTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string()
});

export const LoginResponseSchema = ApiSuccessSchema.extend({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: AuthenticatedUserSchema
});

export const BootstrapRequestSchema = z.object({
  systemAdmin: z.object({
    nombre: z.string().default('System'),
    apellido: z.string().default('Admin'),
    email: z.string().email().default('admin@local.test'),
    password: z.string().min(8)
  }),
  tenant: z.object({
    nombre: z.string().default('Tenant Inicial')
  }).default({}),
  subscription: z.object({
    plan: PlanSuscripcionSchema.default('BASICO'),
    maxUsuarios: z.number().int().positive().default(5),
    maxInmuebles: z.number().int().positive().default(100)
  }).default({}),
  inmobiliaria: z.object({
    nombre: z.string().default('Inmobiliaria Inicial'),
    razonSocial: z.string().default('Inmobiliaria Inicial SRL'),
    identificacionFiscal: z.string().default('30-00000000-0'),
    direccion: z.string().default('Direccion pendiente'),
    telefono: z.string().default('0000-0000'),
    email: z.string().email().default('inmobiliaria@local.test'),
    moneda: z.string().default('ARS')
  }).default({}),
  tenantAdmin: z.object({
    nombre: z.string().default('Tenant'),
    apellido: z.string().default('Admin'),
    email: z.string().email().default('tenant-admin@local.test'),
    password: z.string().min(8)
  })
});

export const BootstrapResponseSchema = ApiSuccessSchema.extend({
  result: z.object({
    bootstrapped: z.boolean(),
    reason: z.string().optional(),
    idTenant: UUIDSchema.optional(),
    idInmobiliaria: UUIDSchema.optional(),
    idSuperUsuario: UUIDSchema.optional(),
    idTenantAdmin: UUIDSchema.optional()
  })
});

export const CreatePropertySchema = z.object({
  tipo: InmuebleSchema.shape.tipo,
  estado: EstadoInmuebleSchema.default('DISPONIBLE'),
  descripcionInterna: z.string(),
  descripcionPublica: z.string(),
  direccion: z.string(),
  ciudad: z.string(),
  provincia: z.string(),
  superficies: z.object({
    cubierta: z.number(),
    descubierta: z.number(),
    total: z.number()
  }),
  banios: z.number().int().nonnegative(),
  idDuenio: UUIDSchema
});

export const UpdatePropertySchema = CreatePropertySchema.partial();

export const PropertyListResponseSchema = ApiSuccessSchema.extend({
  items: z.array(InmuebleSchema)
});

export const PropertyDetailResponseSchema = ApiSuccessSchema.extend({
  item: InmuebleSchema
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RefreshRequest = z.infer<typeof RefreshRequestSchema>;
export type AuthenticatedUser = z.infer<typeof AuthenticatedUserSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type BootstrapRequest = z.infer<typeof BootstrapRequestSchema>;
export type BootstrapResponse = z.infer<typeof BootstrapResponseSchema>;
export type CreatePropertyInput = z.infer<typeof CreatePropertySchema>;
export type UpdatePropertyInput = z.infer<typeof UpdatePropertySchema>;
export type PropertyListResponse = z.infer<typeof PropertyListResponseSchema>;
export type PropertyDetailResponse = z.infer<typeof PropertyDetailResponseSchema>;
