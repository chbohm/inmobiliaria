# Prompt: UI Angular para Plataforma SaaS Inmobiliaria

## Rol

Actua como un frontend architect senior especializado en:

- Angular moderno
- TypeScript
- Arquitecturas frontend escalables
- UX para productos SaaS empresariales
- Diseno de componentes reutilizables
- Aplicaciones master-detail
- Integracion con APIs REST
- Accesibilidad
- Interfaces desktop-first complejas

Tu objetivo es disenar e implementar la UI inicial de la plataforma inmobiliaria con una base seria para crecer, usando Angular moderno desde el inicio.

---

# Decision tecnologica

La UI debe construirse con:

- Angular moderno
- TypeScript
- Angular Router
- HttpClient
- Reactive Forms
- Standalone Components
- Signals cuando aporten claridad al estado local o compartido
- CSS o SCSS modular

No utilizar AngularJS.

No utilizar jQuery.

No construir una SPA en JavaScript manual si el objetivo es una base seria y escalable.

La solucion debe priorizar buenas practicas de Angular contemporaneo:

- standalone components
- route guards
- interceptors
- servicios por dominio
- layout components reutilizables
- separacion por features
- formularios reactivos
- composicion clara entre shell, paginas y componentes presentacionales

No agregar complejidad innecesaria.

No usar NgRx de entrada salvo que sea estrictamente necesario.

Los datos compartidos entre frontend y backend deben vivir en un paquete comun tipado y visible para ambos proyectos.

---

# Objetivo general

Construir una interfaz web profesional para la plataforma SaaS inmobiliaria, preparada para crecer funcionalmente sin reescritura total.

La UI debe soportar dos experiencias principales segun el tipo de usuario autenticado:

- Usuario de sistema con scope `SYSTEM`
- Usuario de inmobiliaria con scope `TENANT`

La interfaz debe sentirse inspirada en VS Code a nivel de layout, navegacion lateral y densidad visual, sin copiar literalmente su identidad visual.

---

# Objetivos funcionales obligatorios

La UI debe permitir:

- Sign in inicial de plataforma para bootstrap del primer tenant y primer super usuario.
- Log in de usuarios existentes.
- Persistencia de sesion con access token y refresh token.
- Deteccion del scope del usuario autenticado.
- Mostrar dashboard distinto segun `SYSTEM` o `TENANT`.
- Navegar con barra lateral fija a la izquierda.
- Abrir configuracion de cuenta desde avatar en la parte inferior de la barra lateral.
- Abrir settings generales desde un boton debajo del avatar.
- Acceder a la vista master-detail de inmuebles.
- Buscar inmuebles.
- Abrir un inmueble y ver sus detalles.
- Desde el detalle del inmueble, abrir el contrato de alquiler actual.
- Ver garantes del contrato actual.
- Ver pagos realizados.
- Ver pagos pendientes.
- Si el usuario es de sistema, ver un master-detail de inmobiliarias.
- Si el usuario es de sistema, poder agregar y modificar inmobiliarias.

---

# Relacion con backend

La UI debe integrarse con estos endpoints del backend:

## Auth

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/logout-all`
- `GET /api/v1/auth/me`

## Bootstrap inicial

- `POST /api/v1/system/bootstrap`

## Sistema

- `GET /api/v1/system/tenants`
- `GET /api/v1/system/tenants/:id`
- `POST /api/v1/system/tenants`
- `PUT /api/v1/system/tenants/:id`
- `GET /api/v1/system/dashboard`

## Inmuebles

- `GET /api/v1/properties`
- `GET /api/v1/properties/:id`
- `POST /api/v1/properties`
- `PUT /api/v1/properties/:id`
- `DELETE /api/v1/properties/:id`

## Dashboard tenant

- `GET /api/v1/dashboard/summary`
- `GET /api/v1/dashboard/upcoming-expirations`
- `GET /api/v1/dashboard/late-payments`

En todos los requests autenticados se debe enviar el bearer token en `Authorization`.

---

# Arquitectura frontend requerida

La aplicacion debe organizarse por features y capas frontend claras.

## Contratos compartidos obligatorios

Todos los contratos compartidos entre frontend y backend deben salir de un paquete comun, por ejemplo:

```text
packages/contracts/
```

Ese paquete debe contener:

- schemas Zod compartidos
- tipos TypeScript compartidos
- DTOs de request y response compartidos
- contratos de dominio que necesiten conocer ambos lados

Ejemplos de contratos que deben vivir ahi:

- autenticacion
- bootstrap inicial
- inmobiliarias
- inmuebles
- contratos
- pagos
- dashboards
- envelopes de API comunes si aplica

Reglas obligatorias:

- el frontend Angular no debe duplicar manualmente interfaces que ya existan en `packages/contracts`
- el backend no debe redefinir DTOs HTTP si ya existen en `packages/contracts`
- los tipos usados por ambos proyectos deben importarse desde ese paquete comun
- si un contrato cambia, debe cambiar una sola vez en `packages/contracts`

El frontend debe consumir directamente ese paquete comun en servicios, stores, formularios y componentes donde corresponda.

## Estructura sugerida

```text
frontend/
  src/
    app/
      app.component.ts
      app.config.ts
      app.routes.ts
      core/
        auth/
          auth.service.ts
          auth.store.ts
          auth.interceptor.ts
          auth.guard.ts
          system-scope.guard.ts
          tenant-scope.guard.ts
          token-storage.service.ts
        api/
          api-client.service.ts
        layout/
          app-shell/
          sidebar/
          topbar/
          account-menu/
        services/
          notifications.service.ts
          dialogs.service.ts
        models/
          auth.models.ts
          api.models.ts
          ui.models.ts
      shared/
        components/
          stat-card/
          master-detail/
          searchable-list/
          empty-state/
          loading-state/
          status-badge/
          form-field/
          modal/
          drawer/
          tabs/
          toolbar/
        pipes/
        directives/
        utils/
      features/
        bootstrap/
          pages/
          components/
          bootstrap.service.ts
        auth/
          pages/
          components/
        system/
          dashboard/
          tenants/
            pages/
            components/
            services/
        tenant/
          dashboard/
          properties/
            pages/
            components/
            services/
          contracts/
          payments/
          contacts/
          settings/
      styles/
        tokens.css
        base.css
        utilities.css
        theme.css
shared/
  contracts/
    src/
      domain.ts
      api.ts
      index.ts
```

No es obligatorio replicar exactamente estos nombres, pero la solucion debe ser equivalente en claridad y separacion.

---

# Principios de arquitectura frontend

- Separar `core`, `shared` y `features`.
- Mantener componentes presentacionales pequenos y reutilizables.
- Centralizar la autenticacion y el manejo de tokens en `core/auth`.
- Implementar guards por autenticacion y por scope.
- Usar interceptors para bearer token y refresh.
- Mantener logica de acceso a backend en servicios dedicados por dominio.
- Consumir contratos tipados desde `packages/contracts` en vez de duplicarlos en `core/models` o en `features`.
- Evitar componentes monoliticos con demasiada responsabilidad.
- Mantener formularios complejos con Reactive Forms.
- Usar Signals o servicios livianos para estado de vista, evitando state management pesado de entrada.

---

# Routing requerido

La aplicacion debe implementar Angular Router con al menos estas rutas:

- `/login`
- `/bootstrap`
- `/system/dashboard`
- `/system/tenants`
- `/tenant/dashboard`
- `/tenant/properties`
- `/tenant/properties/:id`
- `/account`
- `/settings`

Las rutas autenticadas deben vivir dentro de un shell comun.

Las rutas de sistema deben requerir `scope = SYSTEM`.

Las rutas tenant deben requerir `scope = TENANT`.

La resolucion del dashboard inicial debe depender del scope del usuario autenticado.

---

# Autenticacion y sesion

La UI debe implementar autenticacion real con Angular.

## Requisitos tecnicos

- `AuthService` para login, refresh, logout y logout-all.
- `HttpInterceptor` para agregar bearer token.
- `HttpInterceptor` o logica central para intentar refresh al recibir 401 una sola vez.
- `AuthGuard` para bloquear rutas privadas.
- `SystemScopeGuard` para rutas `SYSTEM`.
- `TenantScopeGuard` para rutas `TENANT`.
- `AuthStore` o servicio de estado para exponer usuario actual, tokens, sesion y scope.

## Caso 1: sistema no inicializado

Si el backend indica que todavia no existe bootstrap inicial, la UI debe mostrar una pantalla de onboarding de plataforma que permita:

- Crear primer super usuario de sistema.
- Crear primer tenant.
- Crear primera inmobiliaria.
- Crear primer admin tenant.
- Enviar el formulario a `POST /api/v1/system/bootstrap`.

Debe verse como onboarding profesional, no como un formulario tecnico crudo.

## Caso 2: sistema inicializado

La UI debe mostrar pantalla de login.

El login debe permitir dos modos:

- Login de sistema.
- Login de inmobiliaria.

### Login de sistema

Campos:

- email
- password

### Login de inmobiliaria

Campos:

- inmobiliariaId
- email
- password

La pantalla debe dejar claro cual modo esta activo.

Tras login exitoso:

- guardar access token segun la estrategia definida
- persistir refresh token de forma controlada
- consultar `GET /api/v1/auth/me`
- resolver si el usuario pertenece a `SYSTEM` o `TENANT`
- redirigir al dashboard correcto

---

# Layout principal

La aplicacion autenticada debe usar un layout de escritorio tipo IDE.

## Estructura general

- barra lateral vertical izquierda fija y angosta
- panel de navegacion secundario opcional
- area principal de contenido
- header superior ligero dentro del area principal
- paneles, tarjetas y vistas densas y legibles

## Sidebar izquierda

Inspiracion:

- VS Code
- productos B2B densos
- navegacion rapida por iconos

Comportamiento:

- fija a la izquierda
- iconos apilados verticalmente
- tooltip al hover
- item activo claramente resaltado
- separacion visual entre acciones principales y acciones de cuenta

### Parte superior de sidebar

Botones principales:

- dashboard
- inmobiliarias solo para `SYSTEM`
- inmuebles
- contratos
- pagos
- contactos
- tareas
- auditoria si aplica

### Parte inferior de sidebar

Debe incluir:

- avatar del usuario para abrir menu de cuenta
- boton de settings debajo del avatar

### Menu de cuenta

Debe permitir:

- ver nombre, email, scope y rol
- cerrar sesion
- cerrar todas las sesiones
- abrir configuracion de cuenta

Este menu debe implementarse como componente reutilizable.

---

# Experiencia segun scope

## Usuario SYSTEM

Debe ver:

- dashboard de sistema
- vista master-detail de inmobiliarias
- formulario para alta de inmobiliaria
- formulario para modificacion de inmobiliaria
- capacidad de navegar tenant por tenant desde la lista

### Dashboard de sistema

Debe mostrar al menos:

- cantidad total de tenants
- tenants activos
- tenants suspendidos
- suscripciones activas
- altas recientes
- actividad reciente del sistema

### Vista master-detail de inmobiliarias

Layout:

- columna izquierda con listado de inmobiliarias
- buscador arriba del listado
- filtros por estado
- boton `Nueva inmobiliaria`
- panel derecho con detalle editable

La columna izquierda debe mostrar:

- nombre comercial
- razon social
- email principal
- estado
- plan o suscripcion si esta disponible

El panel derecho debe mostrar:

- datos generales de inmobiliaria
- configuracion visual
- estado del tenant
- datos de suscripcion
- acciones de guardar cambios

La experiencia debe permitir seleccionar una inmobiliaria de la lista y ver su detalle sin navegar a otra pagina completa.

La pantalla debe componerse de componentes reutilizables y no de una sola pagina gigante.

## Usuario TENANT

Debe ver:

- dashboard de inmobiliaria
- vista master-detail de inmuebles
- detalle de inmueble
- contrato actual
- garantes
- pagos realizados y pendientes

### Dashboard de inmobiliaria

Debe mostrar:

- cantidad de inmuebles
- contratos activos
- vencimientos proximos
- pagos atrasados
- ingresos del periodo
- tareas pendientes

Tambien debe incluir:

- accesos rapidos a inmuebles
- alertas de contratos por vencer
- resumen de cobros pendientes

---

# Vista master-detail de inmuebles

Esta vista es obligatoria y debe ser una de las principales del sistema tenant.

## Columna izquierda

Debe contener:

- buscador de inmuebles por direccion, ciudad o estado
- filtros rapidos
- listado scrolleable
- boton para crear nuevo inmueble

Cada item del listado debe mostrar:

- direccion
- ciudad
- estado
- tipo de inmueble
- duenio o referencia del duenio si esta disponible

## Panel derecho

Cuando se selecciona un inmueble debe mostrar su detalle.

### Header del detalle

Debe mostrar:

- direccion principal
- ciudad y provincia
- badge de estado
- tipo de inmueble
- acciones editar y desactivar

### Secciones del detalle de inmueble

Debe incluir al menos:

- descripcion interna
- descripcion publica
- superficies
- banios
- duenio
- historial basico
- documentos si existen

### Contrato actual

Dentro del detalle del inmueble debe existir una seccion clara para `Contrato de alquiler actual`.

Si existe contrato actual, mostrar:

- fecha de inicio
- fecha de fin
- monto actual
- proxima actualizacion
- indice de actualizacion
- periodo de actualizacion

### Garantes

Dentro del contrato actual debe haber una seccion de garantes mostrando:

- nombre o contacto
- porcentaje
- comentario
- vigencia

### Pagos

La vista del inmueble o del contrato debe separar claramente:

- pagos realizados
- pagos pendientes

Cada pago debe poder mostrar:

- periodo
- monto original
- monto pagado
- monto por atraso si aplica
- estado
- fecha de vencimiento
- fecha de pago si existe
- responsable del pago

La UX debe facilitar entender rapidamente la situacion financiera del inmueble.

---

# Componentes reutilizables obligatorios

La implementacion debe construir una biblioteca interna minima de componentes reutilizables.

## Layout

- `AppShellComponent`
- `SidebarComponent`
- `TopbarComponent`
- `AccountMenuComponent`
- `SectionHeaderComponent`

## Data display

- `StatCardComponent`
- `StatusBadgeComponent`
- `EmptyStateComponent`
- `LoadingStateComponent`
- `SearchableListComponent`
- `MasterDetailComponent`
- `InfoGridComponent`
- `EntityToolbarComponent`

## Interaction

- `ModalComponent`
- `DrawerComponent`
- `ConfirmDialogComponent`
- `ToastComponent`
- `TabsComponent`

## Forms

- `FormFieldComponent`
- `TextInputComponent`
- `SelectInputComponent`
- `TextareaInputComponent`
- `SubmitBarComponent`

Estos componentes deben ser reutilizables entre las vistas de sistema y tenant.

---

# Estado de aplicacion

La app debe manejar estado global minimo para:

- sesion actual
- usuario actual
- scope actual
- inmobiliaria activa
- listado cargado de tenants
- listado cargado de inmuebles
- inmueble seleccionado
- loading global y local
- errores de red y de dominio

La recomendacion es usar:

- Signals para estado UI local o compartido simple
- servicios singleton para estado de sesion y datos de pagina cuando tenga sentido

No introducir una capa de state management pesada si el problema todavia no lo requiere.

---

# Formularios

Todos los formularios relevantes deben implementarse con Reactive Forms.

Cada formulario debe incluir:

- validacion del lado cliente
- mensajes de error claros
- estado disabled durante submit
- feedback visual de exito o error
- consistencia de labels, spacing y acciones

Formularios obligatorios:

- bootstrap inicial
- login sistema
- login tenant
- alta de inmobiliaria
- edicion de inmobiliaria
- alta de inmueble
- edicion de inmueble

---

# Diseno visual

La interfaz debe ser parecida a VS Code en estructura, pero adaptada a un producto inmobiliario.

## Direccion visual

- aspecto profesional
- atmosfera de aplicacion desktop moderna
- foco en productividad
- densidad media-alta de informacion
- buena jerarquia visual
- sensacion de herramienta de trabajo diaria

## Estilo

- sidebar oscura o de alto contraste respecto del contenido
- area principal mas clara para lectura de datos
- tipografia limpia y consistente
- iconografia simple
- estados activos muy claros
- tablas y listas legibles
- cards con bordes sutiles
- modales sobrios
- formularios bien alineados

## Requisito clave

Evitar una UI generica de marketing. Debe sentirse como un producto B2B serio y operativo.

---

# Responsive

La UI es desktop-first, pero debe funcionar correctamente en mobile.

En mobile:

- sidebar debe colapsar
- master-detail debe adaptarse a navegacion apilada
- formularios deben seguir siendo legibles
- listas extensas deben seguir siendo navegables

---

# Accesibilidad

Minimos obligatorios:

- estructura semantica correcta
- labels asociados a inputs
- navegacion por teclado
- foco visible
- contraste suficiente
- uso adecuado de `aria-*` cuando haga falta

---

# Testing frontend recomendado

La base frontend debe quedar preparada para testing.

Minimos recomendados:

- tests unitarios de servicios core
- tests de guards
- tests de interceptors
- tests de formularios criticos
- tests de componentes reutilizables clave

No hace falta una suite exhaustiva en la primera iteracion, pero la arquitectura debe permitir escalar testing sin dolor.

---

# Entregable esperado

La implementacion debe incluir:

- app Angular configurada correctamente
- shell principal autenticado
- login y bootstrap funcionales en UI
- dashboard de sistema
- dashboard de inmobiliaria
- vista master-detail de inmobiliarias
- vista master-detail de inmuebles
- detalle de inmueble con contrato actual, garantes y pagos
- integracion real con la API usando HttpClient
- auth guard, scope guards e interceptor de auth
- componentes reutilizables reales
- estilos consistentes y mantenibles

---

# Criterios de calidad

La UI debe ser:

- clara
- profesional
- mantenible
- modular
- escalable
- coherente con un SaaS B2B
- parecida a VS Code en layout y navegacion
- lista para crecer sin reescritura total

---

# Instruccion final

Genera la UI completa respetando estas reglas:

- Angular moderno, no AngularJS
- TypeScript en todo el frontend
- standalone components
- componentes reutilizables
- arquitectura por features
- auth robusta con guards e interceptors
- separacion clara entre experiencia `SYSTEM` y `TENANT`
- priorizar la vista master-detail de inmobiliarias e inmuebles como centro de la aplicacion
- base seria para crecimiento de largo plazo

## Panel derecho

Cuando se selecciona un inmueble debe mostrar su detalle.

### Header del detalle

Debe mostrar:

- direccion principal
- ciudad y provincia
- badge de estado
- tipo de inmueble
- acciones editar y desactivar

### Secciones del detalle de inmueble

Debe incluir al menos:

- descripcion interna
- descripcion publica
- superficies
- banios
- duenio
- historial basico
- documentos si existen

### Contrato actual

Dentro del detalle del inmueble debe existir una seccion clara para `Contrato de alquiler actual`.

Si existe contrato actual, mostrar:

- fecha de inicio
- fecha de fin
- monto actual
- proxima actualizacion
- indice de actualizacion
- periodo de actualizacion

### Garantes

Dentro del contrato actual debe haber una seccion de garantes mostrando:

- nombre o contacto
- porcentaje
- comentario
- vigencia

### Pagos

La vista del inmueble o del contrato debe separar claramente:

- pagos realizados
- pagos pendientes

Cada pago debe poder mostrar:

- periodo
- monto original
- monto pagado
- monto por atraso si aplica
- estado
- fecha de vencimiento
- fecha de pago si existe
- responsable del pago

La UX debe facilitar entender rapidamente la situacion financiera del inmueble.

---

# Comportamiento visual

La interfaz debe ser parecida a VS Code en estructura, pero adaptada a un producto inmobiliario.

## Direccion visual

- aspecto profesional
- atmosfera de aplicacion desktop moderna
- paneles sobrios
- foco en productividad
- densidad media-alta de informacion
- buena jerarquia visual

## Layout y estilo

- sidebar oscura o de alto contraste respecto del contenido
- area principal mas clara para lectura de datos
- tipografia limpia y consistente
- iconografia simple
- estados activos muy claros
- tablas y listas legibles
- cards con bordes sutiles
- modales sobrios
- formularios bien alineados

## Requisito clave

Evitar una UI generica de marketing. Debe sentirse como una herramienta de trabajo diario, no como una landing page.

---

# Componentes reutilizables requeridos

Implementar componentes o modulos reutilizables para:

- app shell
- sidebar
- top bar
- view container
- searchable list
- master-detail layout
- stat card
- form field
- modal
- drawer o panel lateral secundario si es util
- tabs o segmented control para cambiar entre secciones del detalle
- badge de estado
- empty state
- loading state
- toast o feedback no intrusivo
- confirm dialog para acciones destructivas

---

# Estructura frontend sugerida

La implementacion debe proponer una estructura parecida a esta:

```text
frontend/
  index.html
  assets/
    icons/
    images/
  styles/
    tokens.css
    base.css
    layout.css
    components.css
    views.css
  js/
    app.js
    router.js
    store.js
    api/
      client.js
      auth-api.js
      system-api.js
      properties-api.js
    auth/
      session-manager.js
      auth-guard.js
    components/
      sidebar.js
      topbar.js
      master-detail.js
      modal.js
      toast.js
    views/
      login-view.js
      bootstrap-view.js
      system-dashboard-view.js
      tenants-view.js
      tenant-dashboard-view.js
      properties-view.js
      property-detail-view.js
      settings-view.js
      account-view.js
    utils/
      dom.js
      formatters.js
      validators.js
```

No es obligatorio usar exactamente estos nombres, pero la solucion debe estar modularizada de forma similar.

---

# Navegacion y routing

Usar routing del lado cliente simple, sin framework.

La UI debe manejar al menos estas vistas:

- `/login`
- `/bootstrap`
- `/system/dashboard`
- `/system/tenants`
- `/tenant/dashboard`
- `/tenant/properties`
- `/tenant/properties/:id`
- `/account`
- `/settings`

La navegacion debe actualizar el contenido principal sin recargar completamente la pagina cuando sea posible.

---

# Estado de aplicacion

La app debe manejar estado global minimo para:

- sesion actual
- usuario actual
- scope actual
- inmobiliaria seleccionada o activa
- listado cargado de tenants
- listado cargado de inmuebles
- inmueble seleccionado
- estado de loading y errores

No usar librerias de estado externas.

---

# Formularios

Los formularios deben tener:

- validacion de cliente basica
- mensajes de error claros
- estados disabled durante submit
- feedback visual de exito o error
- consistencia de espaciado y labels

Formularios obligatorios:

- bootstrap inicial
- login sistema
- login tenant
- alta de inmobiliaria
- edicion de inmobiliaria
- alta de inmueble
- edicion de inmueble

---

# Responsive

Aunque la UI este pensada como desktop-first, debe seguir funcionando en mobile.

En mobile:

- sidebar debe colapsar
- master-detail debe pasar a una navegacion apilada
- formularios deben seguir siendo legibles
- tablas muy anchas deben adaptarse o convertirse a listas

---

# Accesibilidad

Minimos obligatorios:

- estructura semantica correcta
- labels asociados a inputs
- navegacion por teclado
- foco visible
- contraste suficiente
- uso adecuado de `aria-*` cuando haga falta

---

# Entregable esperado

La implementacion debe incluir:

- HTML inicial de la app
- CSS modularizado con tokens visuales
- JavaScript modular
- app shell completa
- login y bootstrap funcionales en UI
- dashboard de sistema
- dashboard de inmobiliaria
- vista master-detail de inmobiliarias
- vista master-detail de inmuebles
- detalle de inmueble con contrato actual, garantes y pagos
- integracion real con la API usando Fetch
- manejo de errores y estados vacios

---

# Criterios de calidad

La UI debe ser:

- clara
- profesional
- mantenible
- modular
- coherente con un SaaS B2B
- parecida a VS Code en layout y navegacion
- lista para crecer sin reescritura total

---

# Instruccion final

Genera la UI completa respetando estas reglas:

- sin frameworks frontend
- codigo modular
- estilos intencionales y no genericos
- orientada a productividad
- separando claramente experiencia `SYSTEM` y `TENANT`
- priorizando la vista master-detail de inmobiliarias e inmuebles como centro de la aplicacion
