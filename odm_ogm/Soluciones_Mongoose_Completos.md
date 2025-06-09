# Soluciones - Ejercicios de Completar Espacios sobre Mongoose y ODM

A continuación encontrarás las soluciones para completar los espacios en blanco de los ejercicios.

## Conexión y Modelos Básicos

### 1. Solución: Esquema y modelo de usuario

```javascript
// Espacio en blanco: Date.now
const userSchema = new Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  registrado: { type: Date, default: Date.now }
})
```

### 2. Solución: Conexión y configuración básica

```javascript
const opciones = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 5,
  serverSelectionTimeoutMS: 5000 // Milisegundos
}

mongoose
  .connect(uri, opciones)
  .then(() => console.log('Conectado a MongoDB')) // Mensaje de éxito
  .catch(err => {
    console.error('Error de conexión:', err)
    process.exit(0) // Termina el proceso
  })
```

### 3. Solución: Creación e instancia de modelos y documentos

```javascript
const libroSchema = new Schema({
  titulo: { type: String, required: true },
  autor: { type: String },
  paginas: { type: Number, required: true } // Tipo Number
})

const Libro = model('Libro', libroSchema)

const miLibro = new Libro({
  // 'Libro' es el modelo
  titulo: '1984',
  autor: 'George Orwell',
  paginas: 328
})
```

## Relaciones entre Documentos

### 4. Solución: Relación Uno a Uno - Estudiante y Pasaporte

```javascript
const studentSchema = new Schema({
  nombre: String,
  pasaporte: { type: Schema.Types.ObjectId, ref: 'Pasaporte' } // Referencia al modelo Pasaporte
})

// En la función:
const miEstudiante = await Estudiante.create({ nombre: 'Luis', pasaporte: miPasaporte._id }) // ID del pasaporte
```

### 5. Solución: Relación Uno a Uno (One-to-One)

```javascript
const usuarioSchema = new Schema({
  nombre: String,
  perfil: { type: Schema.Types.ObjectId, ref: 'Perfil' } // Referencia al modelo Perfil
})

// En la función:
const usuario = await Usuario.create({ nombre: 'Sofía', perfil: perfil._id }) // ID del perfil
```

### 6. Solución: Relación Muchos a Muchos - Cursos y Estudiantes

```javascript
const cursoSchema = new Schema({
  nombre: String,
  estudiantes: [{ type: Schema.Types.ObjectId, ref: 'Estudiante' }] // Referencia al modelo Estudiante
})

// En la función:
const curso = await Curso.create({ nombre: 'Bases de Datos', estudiantes: [estudiante._id] }) // Array con ID del estudiante
```

### 7. Solución: Relación Muchos a Muchos (Many-to-Many)

```javascript
const cursoSchema = new Schema({
  nombre: String,
  estudiantes: [{ type: Schema.Types.ObjectId, ref: 'Estudiante' }] // Referencia al modelo Estudiante
})

// En la función:
estudiante.cursos.push(curso._id) // ID del curso
```

### 8. Solución: Referencia muchos a muchos (ejemplo completo)

```javascript
const libroSchema = new Schema({
  titulo: String,
  autores: [{ type: Schema.Types.ObjectId, ref: 'Autor' }] // Referencia al modelo Autor
})
```

## Modelos Relacionados y Funcionalidades Avanzadas

### 9. Solución: Archivo `index.js` casi completo

```javascript
const productoSchema = new Schema({
  nombre: String,
  precio: Number,
  categoria: { type: Schema.Types.ObjectId, ref: 'Categoria' } // Referencia al modelo Categoria
})
```

### 10. Solución: Índices e inserción masiva

```javascript
// Índice: -1 para orden descendente
ventaSchema.index({ producto: 1, fecha: -1 })

// Método para inserción masiva:
async function insertarVentas(ventas) {
  await Venta.insertMany(ventas)
}
```

### 11. Solución: Enums y valores por defecto

```javascript
const usuarioSchema = new Schema({
  nombre: String,
  rol: {
    type: String,
    enum: ['admin', 'editor', 'lector'],
    default: 'lector' // Valor por defecto más restrictivo
  }
})
```

## Utilidades y Funciones Auxiliares

### 12. Solución: Parseo de JSON y manejo de errores

```javascript
function parsearObjeto(str) {
  try {
    return JSON.parse(str) // Método para parsear JSON
  } catch (error) {
    console.error('Error al parsear:', error)
    return null
  }
}
```

### 13. Solución: Importaciones ES6 y exportaciones

```javascript
import mongoose from 'mongoose' // Palabra clave 'import'

export default Libro // Exportación por defecto
// Alternativa: export const Libro;  // Exportación nombrada
```

### 14. Solución: Campo con tipo Decimal128 y valor por defecto

```javascript
const productoSchema = new Schema({
  nombre: String,
  precio: { type: mongoose.Types.Decimal128 }, // Tipo Decimal128
  fechaCreacion: { type: Date, default: Date.now } // Método Date.now sin paréntesis
})
```

### 15. Solución: Lógica de agregación

```javascript
const resultado = await Modelo.aggregate([{ $group: { _id: '$campo', total: { $sum: 1 } } }]) // $sum: 1 cuenta ocurrencias
console.log('Totales:', resultado)
```
