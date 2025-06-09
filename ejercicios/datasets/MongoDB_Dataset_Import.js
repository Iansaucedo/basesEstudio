// MongoDB E-commerce Dataset para importar
// Ejecutar este script con: mongosh < MongoDB_Dataset_Import.js

// Crear y seleccionar la base de datos
db = db.getSiblingDB('ecommerce')

// Limpiar colecciones existentes
db.usuarios.drop()
db.productos.drop()
db.categorias.drop()
db.pedidos.drop()
db.reviews.drop()

// Insertar categorías
const categoriasIds = {}
const categorias = [
  { nombre: 'Electrónica', descripcion: 'Dispositivos y gadgets electrónicos' },
  { nombre: 'Ropa', descripcion: 'Prendas de vestir y accesorios' },
  { nombre: 'Hogar', descripcion: 'Productos para el hogar y decoración' },
  { nombre: 'Deportes', descripcion: 'Artículos deportivos y fitness' },
  { nombre: 'Libros', descripcion: 'Libros impresos y digitales' }
]

categorias.forEach(categoria => {
  const result = db.categorias.insertOne(categoria)
  categoriasIds[categoria.nombre] = result.insertedId
})

// Insertar productos
const productosIds = []
const productos = [
  {
    nombre: 'Smartphone XYZ',
    descripcion: 'Teléfono inteligente de última generación',
    precio: 599.99,
    stock: 100,
    categoria_id: categoriasIds['Electrónica'],
    caracteristicas: {
      pantalla: '6.5 pulgadas',
      procesador: 'Octa-core',
      memoria: '8GB RAM',
      almacenamiento: '128GB'
    },
    fechaCreacion: new Date('2023-01-15')
  },
  {
    nombre: 'Laptop UltraBook',
    descripcion: 'Laptop ligera y potente',
    precio: 1299.99,
    stock: 50,
    categoria_id: categoriasIds['Electrónica'],
    caracteristicas: {
      pantalla: '14 pulgadas',
      procesador: 'Intel i7',
      memoria: '16GB RAM',
      almacenamiento: '512GB SSD'
    },
    fechaCreacion: new Date('2023-02-10')
  },
  {
    nombre: 'Camiseta Casual',
    descripcion: 'Camiseta de algodón premium',
    precio: 29.99,
    stock: 200,
    categoria_id: categoriasIds['Ropa'],
    caracteristicas: {
      material: '100% algodón',
      tallas: ['S', 'M', 'L', 'XL'],
      colores: ['Azul', 'Rojo', 'Negro']
    },
    fechaCreacion: new Date('2023-01-20')
  },
  {
    nombre: 'Zapatillas Running',
    descripcion: 'Zapatillas para correr con amortiguación',
    precio: 89.99,
    stock: 75,
    categoria_id: categoriasIds['Deportes'],
    caracteristicas: {
      material: 'Malla sintética',
      tallas: [38, 39, 40, 41, 42, 43, 44],
      colores: ['Negro/Rojo', 'Azul/Blanco']
    },
    fechaCreacion: new Date('2023-03-05')
  },
  {
    nombre: 'Set de Sartenes',
    descripcion: 'Juego de 3 sartenes antiadherentes',
    precio: 79.99,
    stock: 30,
    categoria_id: categoriasIds['Hogar'],
    caracteristicas: {
      material: 'Aluminio con recubrimiento cerámico',
      piezas: 3,
      aptoInduccion: true
    },
    fechaCreacion: new Date('2023-02-20')
  },
  {
    nombre: 'Novela Bestseller',
    descripcion: 'Última novela del autor reconocido',
    precio: 19.99,
    stock: 150,
    categoria_id: categoriasIds['Libros'],
    caracteristicas: {
      formato: 'Tapa blanda',
      paginas: 320,
      idioma: 'Español'
    },
    fechaCreacion: new Date('2023-01-10')
  },
  {
    nombre: 'Smartwatch Fitness',
    descripcion: 'Reloj inteligente con funciones deportivas',
    precio: 149.99,
    stock: 60,
    categoria_id: categoriasIds['Electrónica'],
    caracteristicas: {
      pantalla: '1.3 pulgadas AMOLED',
      bateria: '10 días',
      resistenciaAgua: '5 ATM',
      sensores: ['Ritmo cardíaco', 'GPS', 'Acelerómetro']
    },
    fechaCreacion: new Date('2023-03-15')
  },
  {
    nombre: 'Chaqueta Impermeable',
    descripcion: 'Chaqueta resistente al agua y viento',
    precio: 119.99,
    stock: 40,
    categoria_id: categoriasIds['Ropa'],
    caracteristicas: {
      material: 'Poliéster reciclado',
      impermeabilidad: '10.000mm',
      tallas: ['S', 'M', 'L', 'XL'],
      colores: ['Verde', 'Azul marino', 'Negro']
    },
    fechaCreacion: new Date('2023-02-25')
  }
]

productos.forEach(producto => {
  const result = db.productos.insertOne(producto)
  productosIds.push(result.insertedId)
})

// Insertar usuarios
const usuariosIds = {}
const usuarios = [
  {
    nombre: 'Ana Rodríguez',
    email: 'ana@example.com',
    direccion: {
      calle: 'Calle Principal 123',
      ciudad: 'Madrid',
      codigoPostal: '28001',
      pais: 'España'
    },
    telefono: '+34612345678',
    fechaRegistro: new Date('2023-01-05'),
    preferencias: {
      recibirOfertas: true,
      categoriasFavoritas: [categoriasIds['Electrónica'], categoriasIds['Libros']]
    }
  },
  {
    nombre: 'Carlos Gómez',
    email: 'carlos@example.com',
    direccion: {
      calle: 'Avenida Secundaria 456',
      ciudad: 'Barcelona',
      codigoPostal: '08001',
      pais: 'España'
    },
    telefono: '+34623456789',
    fechaRegistro: new Date('2023-01-10'),
    preferencias: {
      recibirOfertas: false,
      categoriasFavoritas: [categoriasIds['Deportes'], categoriasIds['Ropa']]
    }
  },
  {
    nombre: 'Elena Martínez',
    email: 'elena@example.com',
    direccion: {
      calle: 'Plaza Mayor 789',
      ciudad: 'Valencia',
      codigoPostal: '46001',
      pais: 'España'
    },
    telefono: '+34634567890',
    fechaRegistro: new Date('2023-02-15'),
    preferencias: {
      recibirOfertas: true,
      categoriasFavoritas: [categoriasIds['Hogar'], categoriasIds['Libros']]
    }
  },
  {
    nombre: 'Luis Fernández',
    email: 'luis@example.com',
    direccion: {
      calle: 'Calle Norte 321',
      ciudad: 'Sevilla',
      codigoPostal: '41001',
      pais: 'España'
    },
    telefono: '+34645678901',
    fechaRegistro: new Date('2023-03-01'),
    preferencias: {
      recibirOfertas: true,
      categoriasFavoritas: [categoriasIds['Electrónica'], categoriasIds['Deportes']]
    }
  }
]

usuarios.forEach(usuario => {
  const result = db.usuarios.insertOne(usuario)
  usuariosIds[usuario.email] = result.insertedId
})

// Insertar pedidos
const pedidos = [
  {
    usuario_id: usuariosIds['ana@example.com'],
    fecha: new Date('2023-02-10'),
    estado: 'Entregado',
    productos: [
      {
        producto_id: productosIds[0], // Smartphone XYZ
        nombre: 'Smartphone XYZ',
        precio: 599.99,
        cantidad: 1
      },
      {
        producto_id: productosIds[5], // Novela Bestseller
        nombre: 'Novela Bestseller',
        precio: 19.99,
        cantidad: 2
      }
    ],
    total: 639.97,
    direccionEnvio: {
      calle: 'Calle Principal 123',
      ciudad: 'Madrid',
      codigoPostal: '28001',
      pais: 'España'
    },
    metodoPago: 'Tarjeta de crédito'
  },
  {
    usuario_id: usuariosIds['carlos@example.com'],
    fecha: new Date('2023-02-20'),
    estado: 'Entregado',
    productos: [
      {
        producto_id: productosIds[3], // Zapatillas Running
        nombre: 'Zapatillas Running',
        precio: 89.99,
        cantidad: 1
      },
      {
        producto_id: productosIds[7], // Chaqueta Impermeable
        nombre: 'Chaqueta Impermeable',
        precio: 119.99,
        cantidad: 1
      }
    ],
    total: 209.98,
    direccionEnvio: {
      calle: 'Avenida Secundaria 456',
      ciudad: 'Barcelona',
      codigoPostal: '08001',
      pais: 'España'
    },
    metodoPago: 'PayPal'
  },
  {
    usuario_id: usuariosIds['elena@example.com'],
    fecha: new Date('2023-03-05'),
    estado: 'Enviado',
    productos: [
      {
        producto_id: productosIds[4], // Set de Sartenes
        nombre: 'Set de Sartenes',
        precio: 79.99,
        cantidad: 1
      }
    ],
    total: 79.99,
    direccionEnvio: {
      calle: 'Plaza Mayor 789',
      ciudad: 'Valencia',
      codigoPostal: '46001',
      pais: 'España'
    },
    metodoPago: 'Transferencia bancaria'
  },
  {
    usuario_id: usuariosIds['luis@example.com'],
    fecha: new Date('2023-03-15'),
    estado: 'Procesando',
    productos: [
      {
        producto_id: productosIds[1], // Laptop UltraBook
        nombre: 'Laptop UltraBook',
        precio: 1299.99,
        cantidad: 1
      },
      {
        producto_id: productosIds[6], // Smartwatch Fitness
        nombre: 'Smartwatch Fitness',
        precio: 149.99,
        cantidad: 1
      }
    ],
    total: 1449.98,
    direccionEnvio: {
      calle: 'Calle Norte 321',
      ciudad: 'Sevilla',
      codigoPostal: '41001',
      pais: 'España'
    },
    metodoPago: 'Tarjeta de crédito'
  },
  {
    usuario_id: usuariosIds['ana@example.com'],
    fecha: new Date('2023-03-20'),
    estado: 'Procesando',
    productos: [
      {
        producto_id: productosIds[6], // Smartwatch Fitness
        nombre: 'Smartwatch Fitness',
        precio: 149.99,
        cantidad: 1
      }
    ],
    total: 149.99,
    direccionEnvio: {
      calle: 'Calle Principal 123',
      ciudad: 'Madrid',
      codigoPostal: '28001',
      pais: 'España'
    },
    metodoPago: 'Tarjeta de crédito'
  }
]

db.pedidos.insertMany(pedidos)

// Insertar reviews
const reviews = [
  {
    producto_id: productosIds[0], // Smartphone XYZ
    usuario_id: usuariosIds['ana@example.com'],
    calificacion: 5,
    titulo: 'Excelente producto',
    comentario: 'Muy satisfecha con la compra, cumple todas mis expectativas.',
    fecha: new Date('2023-02-15'),
    util: 10
  },
  {
    producto_id: productosIds[1], // Laptop UltraBook
    usuario_id: usuariosIds['luis@example.com'],
    calificacion: 4,
    titulo: 'Buena laptop pero algo cara',
    comentario: 'Buen rendimiento pero creo que la relación calidad-precio podría ser mejor.',
    fecha: new Date('2023-03-25'),
    util: 5
  },
  {
    producto_id: productosIds[3], // Zapatillas Running
    usuario_id: usuariosIds['carlos@example.com'],
    calificacion: 5,
    titulo: 'Perfectas para correr',
    comentario: 'Muy cómodas y buena amortiguación. Las recomiendo totalmente.',
    fecha: new Date('2023-02-25'),
    util: 8
  },
  {
    producto_id: productosIds[4], // Set de Sartenes
    usuario_id: usuariosIds['elena@example.com'],
    calificacion: 3,
    titulo: 'Calidad aceptable',
    comentario: 'Son buenas pero esperaba mayor durabilidad del recubrimiento.',
    fecha: new Date('2023-03-15'),
    util: 3
  },
  {
    producto_id: productosIds[5], // Novela Bestseller
    usuario_id: usuariosIds['ana@example.com'],
    calificacion: 5,
    titulo: 'No pude dejar de leerlo',
    comentario: 'Una historia fascinante de principio a fin, totalmente recomendado.',
    fecha: new Date('2023-02-20'),
    util: 12
  },
  {
    producto_id: productosIds[0], // Smartphone XYZ
    usuario_id: usuariosIds['carlos@example.com'],
    calificacion: 4,
    titulo: 'Buen teléfono pero batería mejorable',
    comentario: 'En general muy buen rendimiento pero la batería podría durar más.',
    fecha: new Date('2023-03-10'),
    util: 7
  }
]

db.reviews.insertMany(reviews)

// Crear índices
db.usuarios.createIndex({ email: 1 }, { unique: true })
db.productos.createIndex({ nombre: 1 })
db.productos.createIndex({ categoria_id: 1 })
db.reviews.createIndex({ producto_id: 1 })
db.reviews.createIndex({ usuario_id: 1 })
db.pedidos.createIndex({ usuario_id: 1 })
db.pedidos.createIndex({ fecha: 1 })

console.log('Dataset de e-commerce importado correctamente.')
