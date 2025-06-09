
# 🧠 Guía de Estudio ODM Mongoose con MongoDB y JavaScript

Este repositorio está diseñado para aprender a utilizar **Mongoose**, el ODM (Object Document Mapper) para **MongoDB** en entornos **Node.js**. Aquí encontrarás ejemplos, esquemas, operaciones CRUD, relaciones, índices y referencias documentadas.

---

## 📦 Instalación del Proyecto

```bash
npm install
```

---

## 🚀 Inicio Rápido

```bash
node index.js
```

Asegúrate de tener MongoDB corriendo en tu máquina local o usa una URI remota (como MongoDB Atlas).

---

## 🧱 1. Esquemas y Modelos

### Ejemplo de Esquema Básico

```js
const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  edad: { type: Number, min: 0 },
  correo: { type: String, unique: true },
  fechaRegistro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
```

---

## 🔗 2. Relaciones entre Documentos

### 2.1. Referencias (One-to-Many)

```js
const PublicacionSchema = new mongoose.Schema({
  titulo: String,
  contenido: String,
  autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }
});
```

### 2.2. Poblado (Population)

```js
Publicacion.find().populate('autor').exec((err, publicaciones) => {
  // publicaciones ahora incluye los datos completos del usuario
});
```

### 2.3. Arrays de Referencias (Many-to-Many)

```js
const GrupoSchema = new mongoose.Schema({
  nombre: String,
  miembros: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }]
});
```

---

## 🔍 3. Índices

Mongoose te permite definir índices para mejorar el rendimiento en las búsquedas.

### Crear un índice único

```js
correo: {
  type: String,
  required: true,
  unique: true,
  index: true
}
```

### Índices compuestos

```js
UsuarioSchema.index({ nombre: 1, correo: 1 });
```

---

## ⚙️ 4. Operaciones CRUD

### Crear

```js
const nuevoUsuario = new Usuario({ nombre: 'Ana', edad: 28 });
await nuevoUsuario.save();
```

### Leer

```js
const usuarios = await Usuario.find({ edad: { $gt: 18 } });
```

### Actualizar

```js
await Usuario.updateOne({ nombre: 'Ana' }, { edad: 29 });
```

### Eliminar

```js
await Usuario.deleteOne({ nombre: 'Ana' });
```

---

## 🧪 5. Validaciones y Tipos de Datos

```js
edad: {
  type: Number,
  required: true,
  min: 0,
  max: 120
}
```

Otros tipos compatibles:
- `String`
- `Number`
- `Date`
- `Boolean`
- `Buffer`
- `ObjectId`
- `Array`
- `Mixed`

---

## 🔄 6. Middlewares (Hooks)

Mongoose permite ejecutar lógica antes o después de ciertas operaciones.

```js
UsuarioSchema.pre('save', function(next) {
  console.log('Guardando usuario...');
  next();
});
```

---

## 🧰 7. Buenas Prácticas

- Separar modelos en `/models`
- Utilizar controladores para operaciones (`/controllers`)
- Manejar errores con `try-catch`
- Usar `lean()` para consultas ligeras

---

## 📚 8. Recursos Recomendados

- [Documentación oficial de Mongoose](https://mongoosejs.com/)
- [MongoDB University](https://university.mongodb.com/)
- [Curso gratuito de MongoDB + Mongoose (YouTube)](https://www.youtube.com/results?search_query=mongodb+mongoose+nodejs)
- [Express.js](https://expressjs.com/)

---

## 🧠 Retos Recomendados

1. Crea un modelo de `Curso` que tenga múltiples `Estudiantes`.
2. Implementa un índice para buscar usuarios por edad.
3. Relaciona `Comentarios` con `Publicaciones` y `Usuarios`.

