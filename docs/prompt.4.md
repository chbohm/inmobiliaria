Quiero rediseñar el dashboard del sistema y del tenant para que ambos compartan la misma estructura general.

Objetivo de interfaz
- La UI debe verse inspirada en VS Code: layout limpio, modular y orientado a productividad.
- Debe tener un sidebar vertical a la izquierda con accesos a las secciones principales.

Estructura del sidebar
- El sidebar debe estar dividido en dos bloques:
1. Bloque superior (navegacion principal): inicialmente 3 botones.
2. Bloque inferior (navegacion secundaria): 2 botones fijos.

Bloque inferior (2 botones obligatorios)
1. Configuracion del usuario logueado.
2. Settings generales:
- En dashboard de sistema: settings del sistema.
- En dashboard de tenant: settings de la inmobiliaria.

Bloque superior (3 botones iniciales)
- Debe incluir como primer boton el acceso al modulo de inmuebles (master-detail).
- Los otros 2 botones quedan preparados para futuras secciones principales.

Modulo de inmuebles (master-detail)
- Vista master:
1. Mostrar una tabla con todos los inmuebles.
2. Permitir filtrar la tabla (busqueda y filtros por campos relevantes).

- Vista detail:
1. Permitir abrir el detalle de cada inmueble desde la tabla.
2. En el detalle, permitir editar la informacion del inmueble.
3. Permitir agregar contratos y gestionar toda la informacion relacionada al inmueble.

Criterios de implementacion
- La estructura debe aplicarse tanto al dashboard del sistema como al dashboard del tenant.
- Debe mantenerse consistencia visual y de navegacion entre ambos dashboards.
- El sidebar debe ser reutilizable y configurable segun contexto (sistema vs tenant).