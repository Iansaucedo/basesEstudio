# 🛠 Ejercicios de Mongoose (ODM)

[🏠 Volver a la Guía de Estudio](../../README_ES.md) | [📚 Guía Mongoose](../../odm_ogm/Guia_Mongoose_ES.md) | [✅ Soluciones](../soluciones/Mongoose_Soluciones.md)

Este documento proporciona una serie de ejercicios prácticos para practicar con Mongoose, el ODM (Object Document Mapper) para MongoDB en entornos Node.js.

---

## 📦 Preparación del Entorno

Antes de empezar con los ejercicios, asegúrate de tener configurado tu entorno:

1. **Instalar las dependencias necesarias**

```bash
mkdir mongoose-ejercicios
cd mongoose-ejercicios
npm init -y
npm install mongoose express dotenv
```

2. **Crear la estructura básica del proyecto**

```
mongoose-ejercicios/
  ├── models/           # Modelos de Mongoose
  ├── controllers/      # Controladores para las operaciones CRUD
  ├── services/         # Lógica de negocio
  ├── routes/           # Rutas de la API
  ├── config/           # Configuración
  ├── .env              # Variables de entorno
  └── app.js            # Punto de entrada
```

3. **Configuración de la conexión a MongoDB (.env)**

```
MONGODB_URI=mongodb://localhost:27017/ejercicios_mongoose
PORT=3000
```

4. **Configuración básica (config/db.js)**

```javascript
const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB conectado')
  } catch (err) {
    console.error('Error conectando a MongoDB:', err.message)
    process.exit(1)
  }
}

module.exports = connectDB
```

5. **Punto de entrada (app.js)**

```javascript
const express = require('express')
const connectDB = require('./config/db')
require('dotenv').config()

// Conectar a MongoDB
connectDB()

const app = express()

// Middleware para JSON
app.use(express.json())

// Rutas básicas
app.get('/', (req, res) => {
  res.send('API funcionando')
})

// Puerto y arranque del servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor ejecutándose en puerto ${PORT}`))
```

---

## 🧩 Ejercicios de Modelado

### Ejercicio 1: Sistema de Biblioteca

**Objetivo**: Crear un sistema para gestionar una biblioteca, con modelos para libros, autores, préstamos y usuarios.

1. **Esquema de Autor (models/autor.js)**

```javascript
// Implementa tu esquema aquí
```

2. **Esquema de Libro (models/libro.js)**

```javascript
// Implementa tu esquema aquí
```

3. **Esquema de Usuario (models/usuario.js)**

```javascript
// Implementa tu esquema aquí
```

4. **Esquema de Préstamo (models/prestamo.js)**

```javascript
// Implementa tu esquema aquí
```

### Ejercicio 2: Blog con Comentarios

**Objetivo**: Diseñar un sistema de blog con posts, comentarios, categorías y usuarios.

1. **Esquema de Usuario (models/blogUsuario.js)**

```javascript
// Implementa tu esquema aquí
```

2. **Esquema de Post (models/post.js)**

```javascript
// Implementa tu esquema aquí
```

3. **Esquema de Comentario (models/comentario.js)**

```javascript
// Implementa tu esquema aquí
```

4. **Esquema de Categoría (models/categoria.js)**

```javascript
// Implementa tu esquema aquí
```

---

## 🧩 Ejercicios de Operaciones CRUD

### Ejercicio 3: API REST para Biblioteca

**Objetivo**: Implementar una API REST completa para el sistema de biblioteca del Ejercicio 1.

1. **Controlador de Autores (controllers/autores.controller.js)**

```javascript
// Implementa el controlador aquí
```

2. **Controlador de Libros (controllers/libros.controller.js)**

```javascript
// Implementa el controlador aquí
```

3. **Controlador de Préstamos (controllers/prestamos.controller.js)**

```javascript
// Implementa el controlador aquí
```

4. **Rutas de la API (routes/api.js)**

```javascript
// Implementa las rutas aquí
```

### Ejercicio 4: Operaciones Avanzadas para Blog

**Objetivo**: Implementar operaciones avanzadas para el sistema de blog del Ejercicio 2.

1. **Servicio para gestionar posts y comentarios (services/blog.service.js)**

```javascript
// Implementa el servicio aquí
```

2. **Controlador con paginación y filtrado (controllers/posts.controller.js)**

```javascript
// Implementa el controlador aquí
```

---

## 🧩 Ejercicios de Consultas y Agregaciones

### Ejercicio 5: Consultas Avanzadas para Biblioteca

**Objetivo**: Implementar consultas avanzadas para el sistema de biblioteca.

1. **Consulta: Libros más prestados (services/estadisticas.service.js)**

```javascript
// Implementa la consulta aquí
```

2. **Consulta: Usuarios con préstamos vencidos**

```javascript
// Implementa la consulta aquí
```

3. **Agregación: Estadísticas de préstamos por género literario**

```javascript
// Implementa la agregación aquí
```

### Ejercicio 6: Análisis de Datos para Blog

**Objetivo**: Implementar análisis de datos para el sistema de blog.

1. **Agregación: Posts más comentados**

```javascript
// Implementa la agregación aquí
```

2. **Agregación: Actividad de usuarios por mes**

```javascript
// Implementa la agregación aquí
```

3. **Consulta: Encontrar posts relacionados por categorías o etiquetas**

```javascript
// Implementa la consulta aquí
```

---

## 🧩 Ejercicios de Validación y Middleware

### Ejercicio 7: Validación Avanzada

**Objetivo**: Implementar validaciones personalizadas para los modelos.

1. **Validación personalizada para emails (models/validator.js)**

```javascript
// Implementa la validación aquí
```

2. **Validación para evitar duplicados**

```javascript
// Implementa la validación aquí
```

### Ejercicio 8: Middleware de Documento y Consulta

**Objetivo**: Implementar middleware para operaciones comunes.

1. **Middleware de pre-guardado para cifrar contraseñas**

```javascript
// Implementa el middleware aquí
```

2. **Middleware de post-consulta para registrar actividad**

```javascript
// Implementa el middleware aquí
```

3. **Plugin personalizado para añadir campos de auditoría**

```javascript
// Implementa el plugin aquí
```

---

## 🚀 Proyecto Completo

### Ejercicio 9: E-commerce con Mongoose

**Objetivo**: Desarrollar un sistema completo de e-commerce utilizando todos los conceptos aprendidos.

1. **Modelos para productos, categorías, usuarios, carritos y pedidos**
2. **API REST completa con controladores y rutas**
3. **Middleware para autenticación y autorización**
4. **Consultas avanzadas para recomendaciones y análisis**
5. **Manejo de errores y validación**

---

## 🔍 Recursos Adicionales

- [Documentación oficial de Mongoose](https://mongoosejs.com/docs/)
- [Patrones de diseño para MongoDB](https://www.mongodb.com/blog/post/building-with-patterns-a-summary)
- [Mejores prácticas para Mongoose](https://masteringjs.io/mongoose)

---

Este documento es parte de la guía de estudio de bases de datos NoSQL. Las soluciones a estos ejercicios las encontrarás en [Mongoose_Soluciones.md](../soluciones/Mongoose_Soluciones.md)
