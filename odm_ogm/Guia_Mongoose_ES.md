# 🧠 Guía de Mongoose para MongoDB y JavaScript

[🏠 Volver a la Guía de Estudio](../README_ES.md) | [📊 Consultas MongoDB](../queries/MongoDB_Consultas_ES.md) | [🛠 ODM/OGM](./ODM_OGM_Guia_ES.md) | [🕸 Neo4j](../queries/Neo4j_CRUD_ES.md)

Esta guía está diseñada para aprender a utilizar **Mongoose**, el ODM (Object Document Mapper) para **MongoDB** en entornos **Node.js**. Aquí encontrarás ejemplos, esquemas, operaciones CRUD, relaciones, índices y referencias documentadas.

---

## 📦 Instalación del Proyecto

```bash
npm install mongoose
```

---

## 🚀 Inicio Rápido

```js
const mongoose = require('mongoose')

// Conectar a MongoDB
mongoose
  .connect('mongodb://localhost/mi_base_datos', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Conectado a MongoDB')
  })
  .catch(err => {
    console.error('Error de conexión a MongoDB:', err)
  })
```

## 📊 Esquemas y Modelos

### Definición de Esquema Básico

```js
const mongoose = require('mongoose')
const { Schema } = mongoose

// Definir un esquema
const usuarioSchema = new Schema({
  nombre: String,
  apellido: String,
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true
  },
  contraseña: {
    type: String,
    required: true,
    minlength: 6
  },
  edad: {
    type: Number,
    min: 18,
    max: 100
  },
  activo: {
    type: Boolean,
    default: true
  },
  rol: {
    type: String,
    enum: ['usuario', 'admin', 'editor'],
    default: 'usuario'
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  ultimoAcceso: Date,
  direcciones: [
    {
      calle: String,
      ciudad: String,
      codigoPostal: String,
      esPrincipal: Boolean
    }
  ],
  metadatos: Schema.Types.Mixed
})

// Crear un modelo desde el esquema
const Usuario = mongoose.model('Usuario', usuarioSchema)
```

### Esquema con Métodos y Virtuals

```js
// Agregar un método de instancia
usuarioSchema.methods.nombreCompleto = function () {
  return `${this.nombre} ${this.apellido}`
}

// Agregar un método estático
usuarioSchema.statics.encontrarPorEmail = function (email) {
  return this.findOne({ email })
}

// Agregar un método de consulta
usuarioSchema.query.activos = function () {
  return this.where({ activo: true })
}

// Definir un campo virtual (no se almacena en la BD)
usuarioSchema.virtual('nombreUsuario').get(function () {
  return this.email.split('@')[0]
})

// Pre middleware (antes de guardar)
usuarioSchema.pre('save', function (next) {
  console.log(`Guardando usuario: ${this.nombre}`)

  // Actualizar fecha de modificación
  this.ultimoAcceso = Date.now()

  next()
})

// Post middleware (después de guardar)
usuarioSchema.post('save', function (doc) {
  console.log(`Usuario guardado: ${doc.nombre}`)
})
```

## 🔍 Operaciones CRUD

### Crear Documentos

```js
// Crear un nuevo documento
const crearUsuario = async () => {
  try {
    const nuevoUsuario = new Usuario({
      nombre: 'Ana',
      apellido: 'Rodríguez',
      email: 'ana@example.com',
      contraseña: 'contraseña123',
      edad: 28,
      direcciones: [
        {
          calle: 'Calle Principal 123',
          ciudad: 'Madrid',
          codigoPostal: '28001',
          esPrincipal: true
        }
      ]
    })

    // Guardar en la base de datos
    const resultado = await nuevoUsuario.save()
    console.log('Usuario guardado:', resultado)
  } catch (error) {
    console.error('Error al guardar:', error.message)
  }
}

// Crear múltiples documentos
const crearVariosUsuarios = async () => {
  try {
    const resultado = await Usuario.create([
      {
        nombre: 'Carlos',
        apellido: 'Pérez',
        email: 'carlos@example.com',
        contraseña: 'pass456',
        edad: 35
      },
      {
        nombre: 'Elena',
        apellido: 'Gómez',
        email: 'elena@example.com',
        contraseña: 'pass789',
        edad: 42
      }
    ])
    console.log(`${resultado.length} usuarios creados`)
  } catch (error) {
    console.error('Error al crear usuarios:', error)
  }
}
```

### Leer Documentos

```js
// Buscar todos los documentos
const buscarUsuarios = async () => {
  try {
    const usuarios = await Usuario.find()
    console.log(`Se encontraron ${usuarios.length} usuarios`)
    return usuarios
  } catch (error) {
    console.error('Error al buscar usuarios:', error)
  }
}

// Buscar con condiciones
const buscarUsuariosFiltrados = async () => {
  try {
    const usuarios = await Usuario.find({ edad: { $gte: 30 } }) // Usuarios de 30 años o más
      .where('activo')
      .equals(true) // Solo activos
      .select('nombre email edad') // Solo algunos campos
      .sort({ apellido: 1 }) // Ordenar por apellido (ascendente)
      .limit(10) // Limitar a 10 resultados
      .skip(20) // Saltar los primeros 20 (para paginación)

    return usuarios
  } catch (error) {
    console.error('Error al filtrar usuarios:', error)
  }
}

// Buscar un documento específico
const buscarUsuarioPorId = async id => {
  try {
    const usuario = await Usuario.findById(id)
    if (!usuario) {
      console.log('Usuario no encontrado')
      return null
    }
    return usuario
  } catch (error) {
    console.error('Error al buscar por ID:', error)
  }
}

// Buscar un solo documento
const buscarUnUsuario = async () => {
  try {
    const usuario = await Usuario.findOne({ email: 'ana@example.com' })
    return usuario
  } catch (error) {
    console.error('Error al buscar usuario:', error)
  }
}
```

### Actualizar Documentos

```js
// Actualizar un documento encontrado
const actualizarUsuario = async id => {
  try {
    // Primero encontrar
    const usuario = await Usuario.findById(id)
    if (!usuario) return null

    // Modificar y guardar
    usuario.edad = 29
    usuario.direcciones.push({
      calle: 'Otra Calle 456',
      ciudad: 'Barcelona',
      codigoPostal: '08001',
      esPrincipal: false
    })

    const usuarioActualizado = await usuario.save()
    return usuarioActualizado
  } catch (error) {
    console.error('Error al actualizar:', error)
  }
}

// Actualizar directamente
const actualizarDirectamente = async id => {
  try {
    const resultado = await Usuario.updateOne(
      { _id: id }, // filtro
      { $set: { edad: 30 } } // actualización
    )
    console.log(`${resultado.modifiedCount} documento actualizado`)
  } catch (error) {
    console.error('Error al actualizar:', error)
  }
}

// Encontrar y actualizar
const encontrarYActualizar = async id => {
  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      { $set: { activo: false } },
      { new: true, runValidators: true } // opciones
    )
    return usuarioActualizado
  } catch (error) {
    console.error('Error al actualizar:', error)
  }
}

// Actualizar múltiples documentos
const actualizarMuchos = async () => {
  try {
    const resultado = await Usuario.updateMany(
      { edad: { $gt: 40 } }, // filtro
      { $set: { rol: 'editor' } } // actualización
    )
    console.log(`${resultado.modifiedCount} documentos actualizados`)
  } catch (error) {
    console.error('Error al actualizar muchos:', error)
  }
}
```

### Eliminar Documentos

```js
// Eliminar un documento
const eliminarUsuario = async id => {
  try {
    const resultado = await Usuario.deleteOne({ _id: id })
    console.log(`${resultado.deletedCount} documento eliminado`)
  } catch (error) {
    console.error('Error al eliminar:', error)
  }
}

// Encontrar y eliminar
const encontrarYEliminar = async id => {
  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(id)
    if (!usuarioEliminado) {
      console.log('Usuario no encontrado')
      return null
    }
    return usuarioEliminado
  } catch (error) {
    console.error('Error al eliminar:', error)
  }
}

// Eliminar múltiples documentos
const eliminarMuchos = async () => {
  try {
    const resultado = await Usuario.deleteMany({ activo: false })
    console.log(`${resultado.deletedCount} documentos eliminados`)
  } catch (error) {
    console.error('Error al eliminar muchos:', error)
  }
}
```

## 📚 Relaciones

### Referencias entre Documentos

```js
// Esquema con referencia
const publicacionSchema = new Schema({
  titulo: String,
  contenido: String,
  autor: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario', // Referencia al modelo Usuario
    required: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
})

const Publicacion = mongoose.model('Publicacion', publicacionSchema)

// Crear publicación con referencia
const crearPublicacion = async autorId => {
  try {
    const publicacion = new Publicacion({
      titulo: 'Mi primera publicación',
      contenido: 'Contenido de la publicación...',
      autor: autorId
    })

    await publicacion.save()
    console.log('Publicación creada')
  } catch (error) {
    console.error('Error al crear publicación:', error)
  }
}

// Buscar con populate
const buscarPublicacionesConAutor = async () => {
  try {
    const publicaciones = await Publicacion.find()
      .populate('autor', 'nombre email -_id') // Segundo parámetro: campos a incluir/excluir
      .exec()

    return publicaciones
  } catch (error) {
    console.error('Error al buscar publicaciones:', error)
  }
}
```

### Referencias en Arrays

```js
// Agregar array de publicaciones al usuario
usuarioSchema.add({
  publicaciones: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Publicacion'
    }
  ]
})

// Función para agregar publicación a un usuario
const agregarPublicacionAUsuario = async (usuarioId, publicacionId) => {
  try {
    await Usuario.findByIdAndUpdate(usuarioId, { $push: { publicaciones: publicacionId } })
    console.log('Publicación agregada al usuario')
  } catch (error) {
    console.error('Error al agregar publicación:', error)
  }
}

// Buscar usuario con sus publicaciones
const buscarUsuarioConPublicaciones = async usuarioId => {
  try {
    const usuario = await Usuario.findById(usuarioId).populate('publicaciones').exec()

    return usuario
  } catch (error) {
    console.error('Error al buscar usuario con publicaciones:', error)
  }
}
```

## 📑 Índices y Rendimiento

```js
// Definir índices en el esquema
usuarioSchema.index({ email: 1 }, { unique: true })
usuarioSchema.index({ apellido: 1, nombre: 1 }) // Índice compuesto
usuarioSchema.index({ 'direcciones.codigoPostal': 1 }) // Índice en campo anidado

// Crear índice programáticamente
const crearIndice = async () => {
  try {
    await Usuario.collection.createIndex(
      { fechaRegistro: -1 },
      { background: true } // No bloquea otras operaciones
    )
    console.log('Índice creado')
  } catch (error) {
    console.error('Error al crear índice:', error)
  }
}

// Listar todos los índices de una colección
const listarIndices = async () => {
  try {
    const indices = await Usuario.collection.getIndexes()
    console.log('Índices:', indices)
  } catch (error) {
    console.error('Error al listar índices:', error)
  }
}

// Eliminar un índice
const eliminarIndice = async () => {
  try {
    await Usuario.collection.dropIndex('email_1')
    console.log('Índice eliminado')
  } catch (error) {
    console.error('Error al eliminar índice:', error)
  }
}
```

## 🛠 Validación Avanzada

```js
const productoSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true,
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
    maxlength: [100, 'El nombre no puede exceder los 100 caracteres']
  },
  precio: {
    type: Number,
    required: true,
    min: [0, 'El precio no puede ser negativo'],
    validate: {
      validator: function (value) {
        // Validación personalizada
        return value % 0.5 === 0 // El precio debe ser múltiplo de 0.5
      },
      message: 'El precio debe ser múltiplo de 0.5'
    }
  },
  codigo: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: function (v) {
        return /^PRD-\d{6}$/.test(v) // Formato: PRD-123456
      },
      message: props => `${props.value} no es un código de producto válido!`
    }
  },
  categorias: {
    type: [String],
    validate: [
      {
        validator: function (array) {
          return array.length >= 1 // Al menos una categoría
        },
        message: 'Un producto debe tener al menos una categoría'
      },
      {
        validator: function (array) {
          // Todas las categorías deben ser únicas
          return new Set(array).size === array.length
        },
        message: 'Las categorías no pueden estar duplicadas'
      }
    ]
  },
  disponibilidad: {
    type: Map,
    of: Number,
    validate: {
      validator: function (map) {
        // Todas las cantidades deben ser positivas
        for (let value of map.values()) {
          if (value < 0) return false
        }
        return true
      },
      message: 'Todas las cantidades deben ser positivas'
    }
  }
})

// Validación a nivel de esquema
productoSchema.pre('validate', function (next) {
  if (this.precio > 1000 && !this.descripcionExtendida) {
    this.invalidate(
      'descripcionExtendida',
      'La descripción extendida es obligatoria para productos de más de 1000€'
    )
  }
  next()
})

const Producto = mongoose.model('Producto', productoSchema)
```

## 🔄 Transacciones

```js
const transferirDinero = async (cuentaOrigenId, cuentaDestinoId, cantidad) => {
  // Iniciar sesión
  const session = await mongoose.startSession()

  try {
    // Iniciar transacción
    session.startTransaction()

    // Restar de la cuenta origen
    const resultadoOrigen = await Cuenta.updateOne(
      { _id: cuentaOrigenId, saldo: { $gte: cantidad } },
      { $inc: { saldo: -cantidad } },
      { session }
    )

    if (resultadoOrigen.modifiedCount !== 1) {
      // La actualización no tuvo éxito (posiblemente saldo insuficiente)
      throw new Error('No se pudo realizar el cargo en la cuenta origen')
    }

    // Sumar a la cuenta destino
    const resultadoDestino = await Cuenta.updateOne(
      { _id: cuentaDestinoId },
      { $inc: { saldo: cantidad } },
      { session }
    )

    if (resultadoDestino.modifiedCount !== 1) {
      throw new Error('No se pudo realizar el abono en la cuenta destino')
    }

    // Registrar la transacción
    await Transaccion.create(
      [
        {
          origen: cuentaOrigenId,
          destino: cuentaDestinoId,
          cantidad,
          fecha: new Date()
        }
      ],
      { session }
    )

    // Confirmar la transacción
    await session.commitTransaction()
    console.log('Transferencia completada con éxito')
  } catch (error) {
    // Revertir la transacción en caso de error
    await session.abortTransaction()
    console.error('Error en la transferencia:', error)
    throw error
  } finally {
    // Finalizar la sesión
    session.endSession()
  }
}
```

---

Este documento es parte de la guía de estudio de bases de datos NoSQL.
