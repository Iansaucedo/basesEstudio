# 🛠 Ejercicios de OGM con Neo4j

[🏠 Volver a la Guía de Estudio](../../README_ES.md) | [📚 Guía Neo4j OGM](../../odm_ogm/OGM_Neo4j_Guia_ES.md) | [✅ Soluciones](../soluciones/OGM_Neo4j_Soluciones.md)

Este documento proporciona ejercicios para practicar con Neo4j OGM (Object Graph Mapper) en aplicaciones Node.js.

---

## 📦 Preparación del Entorno

Antes de empezar con los ejercicios, asegúrate de tener configurado tu entorno:

1. **Instalar las dependencias necesarias**

```bash
mkdir neo4j-ogm-ejercicios
cd neo4j-ogm-ejercicios
npm init -y
npm install neo4j-driver express dotenv
```

2. **Crear la estructura básica del proyecto**

```
neo4j-ogm-ejercicios/
  ├── models/           # Definición de modelos y acceso a datos
  ├── controllers/      # Controladores para las operaciones
  ├── services/         # Lógica de negocio
  ├── routes/           # Rutas de la API
  ├── config/           # Configuración
  ├── .env              # Variables de entorno
  └── app.js            # Punto de entrada
```

3. **Configuración de la conexión a Neo4j (.env)**

```
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=password
PORT=3000
```

4. **Configuración básica (config/db.js)**

```javascript
const neo4j = require('neo4j-driver')
require('dotenv').config()

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
)

// Verificar conexión
const verifyConnectivity = async () => {
  try {
    await driver.verifyConnectivity()
    console.log('Neo4j conectado correctamente')
  } catch (error) {
    console.error('Error conectando a Neo4j:', error)
    process.exit(1)
  }
}

// Función para cerrar la conexión al finalizar la aplicación
const closeDriver = () => {
  return driver.close()
}

module.exports = { driver, verifyConnectivity, closeDriver }
```

5. **Punto de entrada (app.js)**

```javascript
const express = require('express')
const { verifyConnectivity, closeDriver } = require('./config/db')
require('dotenv').config()

// Verificar conexión a Neo4j
verifyConnectivity()

const app = express()

// Middleware para JSON
app.use(express.json())

// Rutas básicas
app.get('/', (req, res) => {
  res.send('API de Neo4j OGM funcionando')
})

// Puerto y arranque del servidor
const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => console.log(`Servidor ejecutándose en puerto ${PORT}`))

// Manejar cierre apropiado de la aplicación
process.on('SIGINT', async () => {
  await closeDriver()
  server.close(() => {
    console.log('Aplicación finalizada correctamente')
    process.exit(0)
  })
})
```

---

## 🧩 Ejercicio 1: Sistema de Gestión de Proyectos

**Objetivo**: Implementar un sistema de gestión de proyectos utilizando Neo4j como base de datos de grafos, modelando las relaciones entre proyectos, tareas, usuarios y equipos.

### Parte 1: Modelado de Datos

Crea la capa de abstracción para acceder a los siguientes tipos de nodos:

1. **Usuario (models/usuario.js)**

```javascript
// Implementa tu modelo aquí
```

2. **Proyecto (models/proyecto.js)**

```javascript
// Implementa tu modelo aquí
```

3. **Tarea (models/tarea.js)**

```javascript
// Implementa tu modelo aquí
```

4. **Equipo (models/equipo.js)**

```javascript
// Implementa tu modelo aquí
```

### Parte 2: Implementación de Relaciones

Ahora, implementa las siguientes operaciones que crean y consultan relaciones:

1. **Asignar usuario a proyecto**
2. **Asignar usuario a equipo**
3. **Crear tarea en proyecto**
4. **Asignar tarea a usuario**

### Parte 3: Consultas Avanzadas

Implementa las siguientes consultas utilizando el driver de Neo4j:

1. **Buscar todos los proyectos de un usuario**
2. **Listar todas las tareas pendientes de un usuario**
3. **Encontrar usuarios que trabajan en los mismos proyectos**
4. **Calcular la carga de trabajo por usuario**

---

## 🧩 Ejercicio 2: Red Social Simplificada

**Objetivo**: Crear una API para una red social simple utilizando Neo4j como base de datos, implementando patrones comunes de interacción social.

### Parte 1: Modelos Básicos

Implementa los siguientes modelos:

1. **Usuario (models/usuarioSocial.js)**

```javascript
// Implementa tu modelo aquí
```

2. **Publicación (models/publicacion.js)**

```javascript
// Implementa tu modelo aquí
```

3. **Comentario (models/comentario.js)**

```javascript
// Implementa tu modelo aquí
```

### Parte 2: Relaciones Sociales

Implementa las operaciones para establecer y consultar las siguientes relaciones:

1. **Seguir a un usuario**
2. **Crear amistad (relación bidireccional)**
3. **Publicar contenido**
4. **Comentar en una publicación**
5. **Dar "me gusta" a una publicación**

### Parte 3: Consultas Sociales

Implementa las siguientes operaciones utilizando el driver de Neo4j:

1. **Obtener el feed de un usuario** (publicaciones de usuarios seguidos)
2. **Sugerir amigos** (personas que siguen a quienes el usuario sigue)
3. **Obtener publicaciones populares** (con más "me gusta" y comentarios)
4. **Encontrar caminos de conexión entre usuarios**

---

## 🧩 Ejercicio 3: Sistema de Recomendación

**Objetivo**: Implementar un sistema de recomendación de productos utilizando las capacidades de grafos de Neo4j.

### Parte 1: Modelado de Datos

Implementa los siguientes modelos:

1. **Cliente (models/cliente.js)**

```javascript
// Implementa tu modelo aquí
```

2. **Producto (models/producto.js)**

```javascript
// Implementa tu modelo aquí
```

3. **Categoría (models/categoria.js)**

```javascript
// Implementa tu modelo aquí
```

4. **Compra (relación entre Cliente y Producto)**

```javascript
// Implementa tu modelo de relación aquí
```

### Parte 2: Operaciones Básicas

Implementa las siguientes operaciones:

1. **Crear clientes y productos**
2. **Registrar compras de productos**
3. **Categorizar productos**
4. **Registrar valoraciones de productos por parte de clientes**

### Parte 3: Algoritmos de Recomendación

Implementa los siguientes algoritmos de recomendación:

1. **Productos similares** (basados en compras comunes)
2. **Recomendaciones personalizadas para un cliente**
3. **Productos populares por categoría**
4. **Recomendaciones basadas en valoraciones similares**

---

## 🧩 Ejercicio 4: Integración de Aplicaciones Completas

**Objetivo**: Desarrollar una API RESTful completa que integre Neo4j OGM con Express.js para una aplicación de viajes.

### Parte 1: Estructura del Proyecto

Organiza el proyecto según la estructura MVC:

1. **Modelos**: Destino, Usuario, Itinerario, Reseña
2. **Controladores**: Para cada entidad
3. **Rutas**: Definición de endpoints REST
4. **Servicios**: Lógica de negocio

### Parte 2: Implementación OGM

Crea una capa de abstracción que actúe como OGM para cada entidad:

1. **Destino (models/destino.js)**

```javascript
// Implementa tu modelo aquí
```

2. **Usuario (models/usuario.js)**

```javascript
// Implementa tu modelo aquí
```

3. **Itinerario (models/itinerario.js)**

```javascript
// Implementa tu modelo aquí
```

4. **Reseña (models/resena.js)**

```javascript
// Implementa tu modelo aquí
```

### Parte 3: API REST

Integra los modelos OGM en controladores y rutas REST:

1. **Controlador (controllers/destinos.controller.js)**
2. **Rutas (routes/destinos.routes.js)**
3. **Servicio (services/recomendaciones.service.js)**

### Parte 4: Extensiones Avanzadas

1. **Implementar autenticación JWT**
2. **Añadir validación de datos**
3. **Crear endpoints para consultas de grafos avanzadas**
4. **Implementar caché para consultas frecuentes**

---

## 🔍 Recursos Adicionales

- [Neo4j Driver Documentation](https://neo4j.com/docs/javascript-manual/current/)
- [Neo4j Cypher Manual](https://neo4j.com/docs/cypher-manual/current/)
- [Graph Algorithms in Neo4j](https://neo4j.com/docs/graph-data-science/current/)
- [Patrones de Diseño para Aplicaciones de Grafos](https://neo4j.com/blog/data-modeling-basics/)

---

Este documento es parte de la guía de estudio de bases de datos NoSQL. Las soluciones a estos ejercicios las encontrarás en [OGM_Neo4j_Soluciones.md](../soluciones/OGM_Neo4j_Soluciones.md)
