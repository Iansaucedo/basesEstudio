# 🧠 Guía General de ODM/OGM para Node.js

[🏠 Volver a la Guía de Estudio](../README_ES.md) | [📊 Consultas MongoDB](../queries/MongoDB_Consultas_ES.md) | [📗 Guía Mongoose](./Guia_Mongoose_ES.md) | [🕸 Guía Neo4j OGM](./OGM_Neo4j_Guia_ES.md)

Esta guía proporciona una visión general de las herramientas ODM (Object Document Mapping) y OGM (Object Graph Mapping) para trabajar con bases de datos NoSQL desde Node.js.

- Para MongoDB con Mongoose (ODM), continue leyendo este documento o revise la [Guía detallada de Mongoose](./Guia_Mongoose_ES.md)
- Para Neo4j con Neo4j Driver (OGM), consulte la [Guía específica de Neo4j OGM](./OGM_Neo4j_Guia_ES.md)

---

## 📦 Sección 1: Mongoose (ODM para MongoDB)

### 🔧 Configuración

```bash
npm install mongoose
```

### 🔗 Conectar a MongoDB

```js
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/midb')
```

### 📊 Definir un Esquema y Modelo

```js
const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  edad: { type: Number, min: 18 },
  activo: { type: Boolean, default: true },
  fechaRegistro: { type: Date, default: Date.now }
})

// Agregar un método al esquema
userSchema.methods.getNombreCompleto = function () {
  return `${this.nombre}`
}

// Método estático
userSchema.statics.encontrarPorEmail = function (email) {
  return this.findOne({ email })
}

// Método de consulta
userSchema.query.activos = function () {
  return this.where({ activo: true })
}

const User = mongoose.model('User', userSchema)
```

### 🔍 Operaciones CRUD

#### Crear

```js
// Crear un documento
const crearUsuario = async () => {
  try {
    const user = new User({
      nombre: 'Ana Rodriguez',
      email: 'ana@example.com',
      edad: 28
    })

    await user.save()
    console.log('Usuario guardado:', user)
  } catch (error) {
    console.error('Error al guardar:', error.message)
  }
}

// Crear múltiples documentos
const crearVariosUsuarios = async () => {
  try {
    const result = await User.create([
      { nombre: 'Carlos Pérez', email: 'carlos@example.com', edad: 32 },
      { nombre: 'Elena Gómez', email: 'elena@example.com', edad: 25 }
    ])
    console.log(`${result.length} usuarios creados`)
  } catch (error) {
    console.error('Error al crear usuarios:', error)
  }
}
```

#### Leer

```js
// Encontrar todos los documentos
const encontrarTodos = async () => {
  const usuarios = await User.find()
  console.log('Usuarios encontrados:', usuarios)
}

// Encontrar con filtros
const encontrarConFiltros = async () => {
  const usuarios = await User.find({ edad: { $gt: 25 } })
    .select('nombre email')
    .sort({ nombre: 1 })
    .limit(10)
  console.log('Usuarios filtrados:', usuarios)
}

// Encontrar uno
const encontrarUno = async () => {
  const usuario = await User.findOne({ email: 'ana@example.com' })
  console.log('Usuario encontrado:', usuario)
}

// Encontrar por ID
const encontrarPorId = async id => {
  try {
    const usuario = await User.findById(id)
    if (!usuario) {
      console.log('Usuario no encontrado')
      return
    }
    console.log('Usuario encontrado por ID:', usuario)
  } catch (error) {
    console.error('Error al buscar por ID:', error)
  }
}
```

#### Actualizar

```js
// Actualizar un documento
const actualizarUsuario = async id => {
  try {
    const usuarioActualizado = await User.findByIdAndUpdate(
      id,
      { $set: { edad: 29, activo: false } },
      { new: true, runValidators: true }
    )
    console.log('Usuario actualizado:', usuarioActualizado)
  } catch (error) {
    console.error('Error al actualizar:', error)
  }
}

// Actualizar múltiples documentos
const actualizarVarios = async () => {
  const resultado = await User.updateMany({ activo: false }, { $set: { activo: true } })
  console.log(`${resultado.modifiedCount} usuarios actualizados`)
}
```

#### Eliminar

```js
// Eliminar un documento
const eliminarUsuario = async id => {
  try {
    await User.findByIdAndDelete(id)
    console.log('Usuario eliminado')
  } catch (error) {
    console.error('Error al eliminar:', error)
  }
}

// Eliminar múltiples documentos
const eliminarVarios = async () => {
  const resultado = await User.deleteMany({ activo: false })
  console.log(`${resultado.deletedCount} usuarios eliminados`)
}
```

## 🔄 Cierre de Conexiones

```js
const cerrarConexiones = async () => {
  await mongoose.connection.close()
  console.log('Conexión MongoDB cerrada')
}
```

---

Este documento es parte de la guía de estudio de bases de datos NoSQL. Revise también la guía específica de Mongoose para más detalles sobre ODM.
