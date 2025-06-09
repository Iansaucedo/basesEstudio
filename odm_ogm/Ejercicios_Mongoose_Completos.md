# Ejercicios de Completar Espacios sobre Mongoose y ODM

En los siguientes ejercicios, deberás completar los espacios en blanco para que el código funcione correctamente.

## Conexión y Modelos Básicos

### 1. Completa el archivo `index.js` para crear un esquema y modelo de usuario

> Completa los espacios en blanco para que el siguiente archivo `index.js` funcione correctamente y permita guardar usuarios con nombre, email (único) y un campo de fecha de registro por defecto.

```javascript
import mongoose from 'mongoose'

const { Schema, model } = mongoose
let uri = 'mongodb://localhost:27017/miapp'

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => {
    console.log('Error de conexión')
    process.exit(0)
  })

// Esquema de usuario
const userSchema = new Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  registrado: { type: Date, default: _______ }
})

// Modelo de usuario
const Usuario = model('Usuario', userSchema)

// Crear y guardar un nuevo usuario
let nuevoUsuario = new Usuario({
  nombre: 'Ana',
  email: 'ana@email.com'
})

nuevoUsuario
  .save()
  .then(() => console.log('Usuario guardado'))
  .catch(err => console.log('Error:', err))
```

### 2. Conexión y configuración básica

> Completa los espacios para lograr una conexión exitosa a una base de datos MongoDB usando Mongoose:

```javascript
import mongoose from 'mongoose'

const uri = 'mongodb://localhost:27017/mi_basededatos'

const opciones = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 5,
  serverSelectionTimeoutMS: _______
}

mongoose
  .connect(uri, opciones)
  .then(() => console.log('_______'))
  .catch(err => {
    console.error('Error de conexión:', err)
    process._______(0)
  })
```

### 3. Creación e instancia de modelos y documentos

> Completa los espacios para definir un esquema, un modelo y crear una instancia de un documento:

```javascript
const { Schema, model } = mongoose

const libroSchema = new Schema({
  titulo: { type: String, required: true },
  autor: { type: String },
  paginas: { type: _______, required: true }
})

const Libro = model('Libro', libroSchema)

const miLibro = new _______({
  titulo: '1984',
  autor: 'George Orwell',
  paginas: 328
})

miLibro
  .save()
  .then(() => console.log('Libro guardado'))
  .catch(err => console.log('Error al guardar:', err))
```

## Relaciones entre Documentos

### 4. Relación Uno a Uno: Un Estudiante y su Pasaporte

> Completa los espacios para que cada estudiante tenga un único pasaporte y cada pasaporte pertenezca a un solo estudiante.

```javascript
const passportSchema = new Schema({
  numero: String,
  pais: String
})

const studentSchema = new Schema({
  nombre: String,
  pasaporte: { type: Schema.Types.ObjectId, ref: '________' }
})

const Pasaporte = model('Pasaporte', passportSchema)
const Estudiante = model('Estudiante', studentSchema)

// Ejemplo de uso
async function crearEstudianteConPasaporte() {
  const miPasaporte = await Pasaporte.create({ numero: '123456', pais: 'MX' })
  const miEstudiante = await Estudiante.create({ nombre: 'Luis', pasaporte: ________ })
}
```

### 5. Relación Uno a Uno (One-to-One)

> Completa los espacios para crear una relación uno a uno entre un usuario y su perfil:

```javascript
const perfilSchema = new Schema({
  bio: String,
  foto: String
})

const usuarioSchema = new Schema({
  nombre: String,
  perfil: { type: Schema.Types.ObjectId, ref: '_______' }
})

const Perfil = model('Perfil', perfilSchema)
const Usuario = model('Usuario', usuarioSchema)

// Ejemplo de uso
async function crearUsuarioConPerfil() {
  const perfil = await Perfil.create({ bio: 'Desarrollador', foto: 'foto.jpg' })
  const usuario = await Usuario.create({ nombre: 'Sofía', perfil: _______ })
}
```

### 6. Relación Muchos a Muchos: Cursos y Estudiantes

> Completa los espacios en el siguiente código donde cada estudiante puede estar en varios cursos y cada curso puede tener varios estudiantes.

```javascript
const cursoSchema = new Schema({
  nombre: String,
  estudiantes: [{ type: Schema.Types.ObjectId, ref: '_________' }]
})

const estudianteSchema = new Schema({
  nombre: String,
  cursos: [{ type: Schema.Types.ObjectId, ref: 'Curso' }]
})

const Curso = model('Curso', cursoSchema)
const Estudiante = model('Estudiante', estudianteSchema)

// Ejemplo de uso
async function inscribirEstudianteEnCurso() {
  const estudiante = await Estudiante.create({ nombre: 'Carmen' })
  const curso = await Curso.create({ nombre: 'Bases de Datos', estudiantes: [__________] })
  estudiante.cursos.push(curso._id)
  await estudiante.save()
}
```

### 7. Relación Muchos a Muchos (Many-to-Many)

> Completa los espacios para relacionar estudiantes con cursos (cada estudiante puede tener varios cursos y cada curso varios estudiantes):

```javascript
const cursoSchema = new Schema({
  nombre: String,
  estudiantes: [{ type: Schema.Types.ObjectId, ref: '_______' }]
})

const estudianteSchema = new Schema({
  nombre: String,
  cursos: [{ type: Schema.Types.ObjectId, ref: 'Curso' }]
})

const Curso = model('Curso', cursoSchema)
const Estudiante = model('Estudiante', estudianteSchema)

// Ejemplo de inscripción
async function inscribir() {
  const estudiante = await Estudiante.create({ nombre: 'Ana' })
  const curso = await Curso.create({ nombre: 'Node.js', estudiantes: [estudiante._id] })
  estudiante.cursos.push(_______)
  await estudiante.save()
}
```

### 8. Completa un archivo `index.js` de referencia muchos a muchos (ejemplo completo)

> Llena todos los espacios en blanco para que se establezca una relación muchos a muchos entre autores y libros, donde un autor puede escribir varios libros y un libro puede tener varios autores.

```javascript
import mongoose from 'mongoose'
const { Schema, model } = mongoose

mongoose.connect('mongodb://localhost:27017/biblioteca', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const autorSchema = new Schema({
  nombre: String,
  libros: [{ type: Schema.Types.ObjectId, ref: 'Libro' }]
})

const libroSchema = new Schema({
  titulo: String,
  autores: [{ type: Schema.Types.ObjectId, ref: '_________' }]
})

const Autor = model('Autor', autorSchema)
const Libro = model('Libro', libroSchema)

async function crearAutoresYLibros() {
  const autor1 = await Autor.create({ nombre: 'Gabriel García Márquez' })
  const autor2 = await Autor.create({ nombre: 'Mario Vargas Llosa' })

  const libro = await Libro.create({
    titulo: 'Cien años de soledad',
    autores: [autor1._id, autor2._id]
  })

  autor1.libros.push(libro._id)
  autor2.libros.push(libro._id)

  await autor1.save()
  await autor2.save()
}

crearAutoresYLibros()
```

## Modelos Relacionados y Funcionalidades Avanzadas

### 9. Ejemplo de completar un archivo `index.js` casi completo

> Rellena los espacios para definir dos modelos relacionados y conectar a la base de datos correctamente.

```javascript
import mongoose from 'mongoose'
const { Schema, model } = mongoose

mongoose.connect('mongodb://localhost:27017/tienda', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const categoriaSchema = new Schema({
  nombre: { type: String, required: true }
})

const productoSchema = new Schema({
  nombre: String,
  precio: Number,
  categoria: { type: Schema.Types.ObjectId, ref: '_________' }
})

const Categoria = model('Categoria', categoriaSchema)
const Producto = model('Producto', productoSchema)

async function crearProductoConCategoria() {
  const cat = await Categoria.create({ nombre: 'Electrónica' })
  const prod = await Producto.create({ nombre: 'Laptop', precio: 1200, categoria: cat._id })
  console.log(prod)
}
```

### 10. Definición de índices e inserción masiva

> Completa los espacios para definir un índice compuesto y realizar una inserción masiva:

```javascript
const ventaSchema = new Schema({
  producto: String,
  fecha: Date,
  cantidad: Number
})

// Índice compuesto por producto y fecha descendente
ventaSchema.index({ producto: 1, fecha: _______ })

const Venta = model('Venta', ventaSchema)

async function insertarVentas(ventas) {
  await Venta._______(ventas)
}
```

### 11. Uso de enums y valores por defecto

> Completa los espacios para definir un campo con enumeración y valor por defecto:

```javascript
const usuarioSchema = new Schema({
  nombre: String,
  rol: {
    type: String,
    enum: ['admin', 'editor', 'lector'],
    default: '_______'
  }
})

const Usuario = model('Usuario', usuarioSchema)
```

## Utilidades y Funciones Auxiliares

### 12. Parseo de JSON y manejo de errores

> Completa los espacios para parsear un string a un objeto JSON y manejar el error correctamente:

```javascript
function parsearObjeto(str) {
  try {
    return JSON._______(str)
  } catch (error) {
    console.error('Error al parsear:', error)
    return null
  }
}
```

### 13. Importaciones ES6 y exportaciones

> Completa los espacios para importar y exportar correctamente un módulo:

```javascript
_______ mongoose from 'mongoose';

export _______ Libro;
```

### 14. Campo con tipo Decimal128 y valor por defecto

> Completa los espacios donde se define un campo con tipo Decimal128 y un campo de fecha con valor por defecto:

```javascript
const productoSchema = new Schema({
  nombre: String,
  precio: { type: mongoose.Types._______ },
  fechaCreacion: { type: Date, default: Date._______ }
})
```

### 15. Lógica de agregación

> Completa los espacios para realizar una agregación que cuenta objetos agrupados por un campo:

```javascript
const resultado = await Modelo.aggregate([{ $group: { _id: '$campo', total: { $sum: _______ } } }])
console.log('Totales:', resultado)
```
