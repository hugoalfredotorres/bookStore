# Primera aplicación con Express — Guía super básica

Este archivo muestra **paso a paso** cómo crear desde cero una aplicación mínima con Express (Node.js).

---

## Requisitos

- Node.js instalado (versión LTS recomendada). Verifica con:

```bash
node -v
npm -v
```

- Terminal / línea de comandos.

---

## 1. Crear carpeta del proyecto

Abre la terminal y crea una carpeta, luego entra en ella:

```bash
mkdir mi-express-app
cd mi-express-app
```

---

## 2. Inicializar `package.json`

Crea el `package.json` básico con npm:

```bash
npm init -y
```

Esto genera un `package.json` con valores por defecto.

---

## 3. Instalar Express

Instala Express como dependencia:

```bash
npm install express
```

(Opcional para desarrollo: `npm install --save-dev nodemon` para recarga automática)

---

## 4. Crear el archivo principal

Crea un archivo llamado `index.js` (o `app.js`). Dentro, pega este código mínimo:

```js
// index.js
const express = require('express');
const app = express();

// Configuración del puerto usando variable de entorno
// Si no existe PORT en el entorno, usa 3000 como valor por defecto
const PORT = process.env.PORT || 3000;

// Ruta raíz
app.get('/', (req, res) => {
  res.send('¡Hola mundo desde Express!');
});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
```

Explicación corta:
- `require('express')`: carga la librería.
- `process.env.PORT`: lee el valor de la variable de entorno `PORT`.
- `app.get('/', ...)`: define una ruta GET para `/`.
- `app.listen(...)`: arranca el servidor en el puerto indicado.

---

## 5. Crear un archivo `.env` (opcional pero recomendado)

Podés crear un archivo llamado `.env` en la raíz del proyecto para definir variables de entorno:

```
PORT=4000
```

Luego instala la librería `dotenv` para que Express pueda leer ese archivo:

```bash
npm install dotenv
```

Y modifica el inicio del archivo `index.js`:

```js
require('dotenv').config(); // Cargar variables del archivo .env
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
```

Así tu aplicación usará automáticamente el puerto que definas en `.env`.

---

## 6. Añadir script de inicio

Edita `package.json` o ejecuta en la terminal:

```bash
npm set-script start "node index.js"
```

Si instalaste `nodemon` como devDependency, añade también:

```bash
npm set-script dev "nodemon index.js"
```

Ahora puedes iniciar el servidor con:

```bash
npm start
# o (desarrollo con recarga automática):
npm run dev
```

---

## 7. Probar que funciona

Abre el navegador en `http://localhost:3000` (o el puerto que hayas puesto en `.env`) y deberías ver: `¡Hola mundo desde Express!`

Alternativa con `curl` desde otra terminal:

```bash
curl http://localhost:3000
```

---

## 8. Buenas prácticas iniciales (muy breves)

- Añadir `.gitignore` (por ejemplo: `node_modules/`, `.env`).
- Usar variables de entorno para el puerto y secretos (p. ej. con `process.env.PORT`).
- Mantener rutas en módulos separados cuando la app crezca.

---

## 9. Ejemplo de estructura de carpetas (mínima)

```
mi-express-app/
├─ index.js
├─ package.json
├─ .env
├─ node_modules/
└─ .gitignore
```

---

## 10. ¿Qué seguir después? (sugerencias rápidas)

- Añadir rutas nuevas (ej.: `/about`, `/api/users`).
- Servir archivos estáticos con `app.use(express.static('public'))`.
- Parsear JSON en peticiones: `app.use(express.json())`.
- Usar router de express: `const router = express.Router()`.

---

## 11. Errores comunes

- **Puerto en uso**: cambia `PORT` o mata el proceso que lo usa.
- **`module not found: express`**: ejecuta `npm install` en la carpeta correcta.
- **No hay respuesta**: revisa la consola para errores de sintaxis.

---

¡Listo! Con esto ya aprendiste a levantar tu primer servidor Express **y** a usar una variable de entorno para configurarlo profesionalmente desde el principio.

