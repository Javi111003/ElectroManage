# Comandos migraciones

----------------------------------------------------------------------------------------------------

Si está ejecutando el proyecto con docker deberá cambiar el server a localhost y puerto al 5433

-----------------------------------------

Comando para **Crear** una migración:

Una vez que modificamos/creamos una entidad y agregamos en caso de ser necesario las configuracines de la misma, en la carpeta Configuration del proyecto de infraestructura, debemos crear la migracion.

`dotnet ef migrations add MigrationName --project ElectroManage.Domain.DataAccess\ElectroManage.Domain.DataAccess.csproj --startup-project ElectroManage.WebAPI\ElectroManage.WebAPI.csproj`

Comando para **Aplicar** una migración:

`dotnet ef database update --project ElectroManage.Infraestructure\ElectroManage.Infraestructure.csproj --startup-project ElectroManage.WebAPI\ElectroManage.WebAPI.csproj`

Comando para **Regresar** a una migración:

Se desea regresar la bd a una migración anterior se utiliza el siguiente comando, el mismo **NO** elimina migración.

`dotnet ef database update MigrationName --project ElectroManage.Infraestructure\ElectroManage.Infraestructure.csproj --startup-project ElectroManage.WebAPI\ElectroManage.WebAPI.csproj`

Comando para **Revertir** la última migración:

`dotnet ef migrations remove --project ElectroManage.Domain.DataAccess\ElectroManage.Domain.DataAccess.csproj --startup-project ElectroManage.WebAPI\ElectroManage.WebAPI.csproj`

# Comando para generar el script de todas las migraciones

En el directorio del proyecto ElectroManage.WebAPI:

`dotnet ef migrations script --idempotent > migrations.sql`

# Convención para Endpoints

De manera general los endpoints siempre serán en plural. Un endpoint de listar usuario sería /users . Por el verbo de la petición se infiere para que es el endpoint, aunque como buena práctica documentemos cada endpoint en lo posible.

Las peticiones Post siempre deben devolver el objeto que se ha creado.

La StatusCode de cada endpoint debe ser lo mas precisa posible, en la mayoria de los casos usaremos:

| Código               | Descripción                                                                                                                                                                                                                                                                                                                                                                |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **200 OK**           | La solicitud ha tenido éxito. [El significado de “éxito” depende del método HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)[1](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)[2](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes).                                                                                                      |
| **201 Created**      | La solicitud ha tenido éxito y se ha creado un nuevo recurso como resultado. [Esto es típicamente la respuesta enviada después de las solicitudes POST, o algunas solicitudes PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)[1](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)[2](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes).     |
| **202 Accepted**     | La solicitud ha sido recibida pero aún no se ha actuado sobre ella. [Está destinado a casos en los que otro proceso o servidor maneja la solicitud, o para el procesamiento por lotes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)[1](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)[2](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes). |
| **204 No Content**   | [No hay contenido para enviar para esta solicitud, pero los encabezados pueden ser útiles](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)[1](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)[2](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes).                                                                                             |
| **400 Bad Request**  | [La solicitud no se pudo entender o estaba solicitando un recurso inexistente](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)[1](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)[2](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes).                                                                                                         |
| **401 Unauthorized** | [Similar al 403 Forbidden, pero específicamente para cuando la autenticación es posible pero ha fallado o aún no ha sido proporcionada](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)[1](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)[2](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes).                                                |
| **403 Forbidden**    | [El cliente no tiene los derechos de acceso al contenido, por lo que el servidor está rechazando dar una respuesta apropiada](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)[1](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)[2](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes).                                                          |
| **404 Not Found**    | [El servidor no pudo encontrar el contenido solicitado](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)[1](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)[2](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes).                                                                                                                                |

# Commits

Para los commits utilizaremos `verb_api: accion del commit`

Los verbos que usaremos de manera general:

- API relevant changes
  
  - `feat` Commits, that adds or remove a new feature
  - `fix` Commits, that fixes a bug

- `refactor` Commits, that rewrite/restructure your code, however does not change any API behaviour
  
- `style` Commits, that do not affect the meaning (white-space, formatting, missing semi-colons, etc)

- `docs` Commits, that affect documentation only

- `build` Commits, that affect build components like build tool, ci pipeline, dependencies, project version, ...
