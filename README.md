# FinViz sample app

App de ejemplo que muestra información de acciones (tomada de [Finviz](https://finviz.com/)) y permite filtrarlas.

Consiste en un SPA y un api backend.

## Requerimientos

- Node
- Express
- MongoDB
- Api key en [Finviz](https://finviz.com/) (requerido solo para obtener datos reales)

## Instrucciones

Para ejecutar la app lo primero que hay que hacer es crear el archivo `.env`, copiandolo de `.env.local` y personalizarlo con la cadena de conexión a MongoDB y el api key de FinViz. Si no poseemos cuenta en FinViz, es posible ejecutar la app precargando la DB con datos fake.

### Si tenemos MongoDB instalado localmente

Para ejecutar MongoDB ejecutar:

```sh
npm run db
```

> El script `backend\run_mongodb.ps1` contiene el path por defecto a MongoDB para la version 7. De encontrarse instalado el mismo en otro path, es necesario personalizar este script con el path correcto.
>
> Si MongoDB no se encuentra escuchando en el puerto por defecto, es necesario configurar el valor de `MONGO_DB_CNN_STRING` en `.env`.

### Si no tenemos MongoDB instalado localmente

Si MongoDB no se encuentra instalado localmente entonces solo hay que personalizar la cadena de conexion (`MONGO_DB_CNN_STRING`) al valor que corresponda en `.env`.

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
