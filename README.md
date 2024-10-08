# FinViz Sample App

![FinViz sample app](header.png)

App de ejemplo que muestra información de acciones (tomada de [Finviz](https://finviz.com/)) y permite filtrarlas.

Las tecnologías usadas durante el desarrollo fueron:

- Vite
- React
- MongoDB
- Express
- Node
- Docker (opcional)

> [!NOTE]
> Esta es una aplicación de ejemplo con el fin de practicar/demostrar el uso de las herramientas con las que la misma esta hecha.
>
> No existe practicamente manejos de errores y puede contener bugs, inconsistencias o errores de ejecución, los cuales pueden nunca ser arreglados.
>
> **NO SE RECOMIENDA PARA USO EN PRODUCCIÓN.**

## Requerimientos

- Node
- MongoDB
- Docker (solo si deseamos ejecutar la version containerizada de la app)
- Api key en [Finviz](https://finviz.com/) (requerido solo para obtener datos reales)

## Instrucciones (con docker)

Luego de haber clonado el repositorio ejecutar desde el root

```sh
docker-compose up
```

Esto va a levantar un contenedor para la DB, otro para el backend y otro para el frontend (website).

> [!NOTE]
> El contenedor del backend NO tiene configurada un Api key de FinViz. Por lo que no podremos obtener datos reales de acciones. Si deseamos configurar una api key, esto se puede hacer en la sección `environment` de `backend` en `docker-compose.yml`:
>
> ```yaml
> environment:
>   FINVIZ_API_KEY: <YOUR_API_KEY>
> ```
>
> Luego de esto, ejecutar
>
> ```sh
> docker-compose up --build
> ```
>
> para generar una nueva imagen del backend.

Por defecto el frontend estará escuchando en [http://localhost:5173](http://localhost:5173).

## Instrucciones (forma manual)

Luego de haber clonado el repositorio ejecutar desde el root

```sh
npm install
```

para bajar todas las dependencias de los proyectos.

Para ejecutar la app lo primero que hay que hacer es crear el archivo `backend\.env`, copiandolo de `backend\.env.sample` y personalizarlo con la cadena de conexión a MongoDB y el api key de FinViz. Si no poseemos cuenta en FinViz, es posible ejecutar la app precargando la DB con datos fake.

### Si tenemos MongoDB instalado localmente

Para levantar MongoDB ejecutar:

```sh
npm run db
```

> El script `backend\run_mongodb.ps1` contiene el path por defecto a MongoDB para la version 7. De encontrarse instalado el mismo en otro path, es necesario personalizar este script con el path correcto.
>
> Si MongoDB no se encuentra escuchando en el puerto por defecto, es necesario configurar el valor de `MONGO_DB_CNN_STRING` en `backend\.env`.

### Si no tenemos MongoDB instalado localmente

Si MongoDB no se encuentra instalado localmente entonces solo hay que personalizar la cadena de conexion (`MONGO_DB_CNN_STRING`) al valor que corresponda en `backend\.env`.

### Backend

Una vez configuradas las variables de entorno ejecutar:

```sh
npm run backend
```

para ejecutar el backend. Navegando a [http://localhost:8090](http://localhost:8090) deberiamos recibir como respuesta:

```json
{"message": "OK"}
```

### Frontend

Para levantar el frontend ejecutar:

```sh
npm run frontend
```

Por defecto el frontend estará escuchando en [http://localhost:5173](http://localhost:5173).

## Uso

La app muestra una lista de acciones con algunos datos fundamentals de ellas.
Esta lista puede ser filtrada por simbolo y/o nombre de la companía.
La lista esta limitada a 50 acciones, por lo que si el filtro configurado es muy amplio, es posible que no veamos todas las acciones.

Si es la primera vez que cargamos la aplicación, se nos ofrecerá la opción de inicializar la DB con datos.
