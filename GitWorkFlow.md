**Procedimiento básico de Git para añadir una nueva característica al proyecto**

Abres la consola en la raíz del proyecto 
Luego chequeas con `git status` en qué rama estás y en qué estado se encuentra 

Si no estás en la rama principal, te cambias a ella con 

`git checkout <nombre_rama>` 

Una vez en la rama principal, antes de crear tu nueva rama para modificar (añadir o arreglar algo) lo que sea del proyecto,
 haces 
`git fetch` 

Este comando escanea el repositorio remoto para ver que hay nuevo en el remoto que no tengas tú en el repositorio local 
Para comprobar en qué estado estás respecto a la rama en el repo remoto haces
 `git status`

-Si tú rama está X commits por detrás de la rama remota, haces: 

`git pull --rebase origin <nombre_rama>`

para traer los cambios del remoto y que tu rama local esté al día 
Si tu rama está al día después del
 `git fetch` 
 o después del procedimiento anterior 

Ya puede empezar el:

**Procedimiento para MODIFICAR el proyecto:**

Estás en la rama principal, luego 

`git checkout -b <tu_rama>` 

para crear una rama local nueva a partir de la de donde estabas parado y cambiarte a esa nueva rama
Los nombres de ramas deben tener la estructura:
verb/simple-msg 
*Los verbos son:
    ⁃ feat/
    ⁃ fix/
    ⁃ refactor/
    ⁃ test/
Ejemplo:

 `git checkout -b fix/list-users`

Ahí trabajas 

Al terminar haces

`git status` 

Y te van a salir los archivos modificados, luego 

`git add .` 

añade todos los elementos que se modificaron para que puedan hacer el commit 
Este se hace con

`git commit -m "Mensaje del commit"` 

(RECUERDEN SEGUIR EL CONVENIO QUE ESTÁ EN EL README DE BACKEND PARA LOS MENSAJES DE LOS COMMITS)

Luego solo resta subir el commit al repositorio remoto 
Primero se cambian de rama a la rama principal y hacen `git fetch` para verificar que no hayan cambios nuevos y su rama esté al día con la rama principal, si hay cambios los traen 
Como explique al principio 
con el:

`git pull --rebase main`

Luego si hubo cambios se van a su rama con 
`git checkout <nombre_rama>`

Una vez parados en su rama hacen 

`git rebase main`

Para que su rama adelante el puntero de commit y esté al día con main 
Luego 

`git push origin <nombre_rama>`

Para subir su rama al repo 

**Listo**

Van a github y crean el Pull Request de su rama hacia main