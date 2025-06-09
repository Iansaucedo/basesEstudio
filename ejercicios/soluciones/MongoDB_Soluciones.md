# 📊 Soluciones de MongoDB

[🏠 Volver a la Guía de Estudio](../../README_ES.md) | [📄 Ejercicios](../queries/MongoDB_Ejercicios.md) | [📑 Dataset](../datasets/MongoDB_Dataset_Import.js)

Este documento contiene las soluciones a los ejercicios de MongoDB.

---

## 🧪 Soluciones

### Nivel 1: Consultas Básicas

1. **Encontrar todos los productos de la categoría "Electrónica"**

   ```javascript
   db.productos.find({
     categoria_id: db.categorias.findOne({ nombre: 'Electrónica' })._id
   })

   // Alternativa con lookup
   db.productos.aggregate([
     {
       $lookup: {
         from: 'categorias',
         localField: 'categoria_id',
         foreignField: '_id',
         as: 'categoria'
       }
     },
     { $unwind: '$categoria' },
     { $match: { 'categoria.nombre': 'Electrónica' } }
   ])
   ```

2. **Listar todos los usuarios ordenados por fecha de registro (más reciente primero)**

   ```javascript
   db.usuarios.find().sort({ fechaRegistro: -1 })
   ```

3. **Buscar productos con stock menor a 50 unidades**

   ```javascript
   db.productos.find({ stock: { $lt: 50 } })
   ```

4. **Encontrar todos los pedidos con estado "Procesando"**

   ```javascript
   db.pedidos.find({ estado: 'Procesando' })
   ```

5. **Buscar productos con precio entre 50 y 200 euros**
   ```javascript
   db.productos.find({ precio: { $gte: 50, $lte: 200 } })
   ```

### Nivel 2: Consultas Intermedias

6. **Encontrar los 3 productos mejor valorados (mayor promedio de calificación)**

   ```javascript
   db.reviews.aggregate([
     { $group: { _id: '$producto_id', calificacionPromedio: { $avg: '$calificacion' } } },
     { $sort: { calificacionPromedio: -1 } },
     { $limit: 3 },
     {
       $lookup: {
         from: 'productos',
         localField: '_id',
         foreignField: '_id',
         as: 'productoInfo'
       }
     },
     { $unwind: '$productoInfo' },
     {
       $project: {
         nombre: '$productoInfo.nombre',
         calificacionPromedio: 1,
         precio: '$productoInfo.precio'
       }
     }
   ])
   ```

7. **Listar usuarios que han realizado más de un pedido**

   ```javascript
   db.pedidos.aggregate([
     { $group: { _id: '$usuario_id', numPedidos: { $sum: 1 } } },
     { $match: { numPedidos: { $gt: 1 } } },
     {
       $lookup: {
         from: 'usuarios',
         localField: '_id',
         foreignField: '_id',
         as: 'usuarioInfo'
       }
     },
     { $unwind: '$usuarioInfo' },
     {
       $project: {
         nombre: '$usuarioInfo.nombre',
         email: '$usuarioInfo.email',
         numPedidos: 1
       }
     }
   ])
   ```

8. **Encontrar productos que contengan "Smart" en su nombre o descripción**

   ```javascript
   db.productos.find({
     $or: [
       { nombre: { $regex: 'Smart', $options: 'i' } },
       { descripcion: { $regex: 'Smart', $options: 'i' } }
     ]
   })
   ```

9. **Calcular el valor total del inventario (suma de precio × stock de todos los productos)**

   ```javascript
   db.productos.aggregate([
     { $project: { valorInventario: { $multiply: ['$precio', '$stock'] } } },
     { $group: { _id: null, valorTotal: { $sum: '$valorInventario' } } }
   ])
   ```

10. **Listar productos agrupados por categoría con su precio promedio**
    ```javascript
    db.productos.aggregate([
      {
        $group: {
          _id: '$categoria_id',
          precioPromedio: { $avg: '$precio' },
          numProductos: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'categorias',
          localField: '_id',
          foreignField: '_id',
          as: 'categoriaInfo'
        }
      },
      { $unwind: '$categoriaInfo' },
      {
        $project: {
          categoria: '$categoriaInfo.nombre',
          precioPromedio: 1,
          numProductos: 1
        }
      },
      { $sort: { categoria: 1 } }
    ])
    ```

### Nivel 3: Agregaciones y Consultas Avanzadas

11. **Obtener el historial de compras de cada usuario con detalles de productos**

    ```javascript
    db.usuarios.aggregate([
      {
        $lookup: {
          from: 'pedidos',
          localField: '_id',
          foreignField: 'usuario_id',
          as: 'pedidos'
        }
      },
      { $unwind: { path: '$pedidos', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          nombre: 1,
          email: 1,
          fecha_pedido: '$pedidos.fecha',
          total: '$pedidos.total',
          productos: '$pedidos.productos',
          estado: '$pedidos.estado'
        }
      },
      { $sort: { email: 1, fecha_pedido: -1 } }
    ])
    ```

12. **Calcular las ventas totales por mes**

    ```javascript
    db.pedidos.aggregate([
      {
        $project: {
          year: { $year: '$fecha' },
          month: { $month: '$fecha' },
          total: 1
        }
      },
      {
        $group: {
          _id: { year: '$year', month: '$month' },
          ventasMensuales: { $sum: '$total' },
          numeroPedidos: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          año: '$_id.year',
          mes: '$_id.month',
          ventasMensuales: 1,
          numeroPedidos: 1
        }
      },
      { $sort: { año: 1, mes: 1 } }
    ])
    ```

13. **Encontrar los productos más vendidos (por cantidad)**

    ```javascript
    db.pedidos.aggregate([
      { $unwind: '$productos' },
      {
        $group: {
          _id: '$productos.producto_id',
          totalVendido: { $sum: '$productos.cantidad' },
          ingresoGenerado: { $sum: { $multiply: ['$productos.precio', '$productos.cantidad'] } }
        }
      },
      {
        $lookup: {
          from: 'productos',
          localField: '_id',
          foreignField: '_id',
          as: 'productoInfo'
        }
      },
      { $unwind: '$productoInfo' },
      {
        $project: {
          nombre: '$productoInfo.nombre',
          totalVendido: 1,
          ingresoGenerado: 1
        }
      },
      { $sort: { totalVendido: -1 } }
    ])
    ```

14. **Analizar las preferencias de compra por región (ciudad)**

    ```javascript
    db.pedidos.aggregate([
      {
        $project: {
          ciudad: '$direccionEnvio.ciudad',
          productos: 1
        }
      },
      { $unwind: '$productos' },
      {
        $lookup: {
          from: 'productos',
          localField: 'productos.producto_id',
          foreignField: '_id',
          as: 'productoInfo'
        }
      },
      { $unwind: '$productoInfo' },
      {
        $lookup: {
          from: 'categorias',
          localField: 'productoInfo.categoria_id',
          foreignField: '_id',
          as: 'categoriaInfo'
        }
      },
      { $unwind: '$categoriaInfo' },
      {
        $group: {
          _id: { ciudad: '$ciudad', categoria: '$categoriaInfo.nombre' },
          cantidad: { $sum: '$productos.cantidad' }
        }
      },
      {
        $project: {
          _id: 0,
          ciudad: '$_id.ciudad',
          categoria: '$_id.categoria',
          cantidad: 1
        }
      },
      { $sort: { ciudad: 1, cantidad: -1 } }
    ])
    ```

15. **Crear un informe de productos con reviews ordenadas por utilidad**
    ```javascript
    db.productos.aggregate([
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'producto_id',
          as: 'reviews'
        }
      },
      { $match: { 'reviews.0': { $exists: true } } },
      {
        $project: {
          nombre: 1,
          precio: 1,
          calificacionPromedio: { $avg: '$reviews.calificacion' },
          totalReviews: { $size: '$reviews' },
          reviews: {
            $sortArray: {
              input: '$reviews',
              sortBy: { util: -1 }
            }
          }
        }
      },
      {
        $project: {
          nombre: 1,
          precio: 1,
          calificacionPromedio: 1,
          totalReviews: 1,
          'reviews.titulo': 1,
          'reviews.comentario': 1,
          'reviews.calificacion': 1,
          'reviews.util': 1
        }
      }
    ])
    ```

---

## 🚀 Soluciones a Retos Adicionales

### 1. Recomendaciones de productos

```javascript
// Recomendaciones de productos basadas en compras anteriores
db.pedidos.aggregate([
  { $match: { usuario_id: usuarioObjectId } },
  { $unwind: '$productos' },
  {
    $lookup: {
      from: 'productos',
      localField: 'productos.producto_id',
      foreignField: '_id',
      as: 'productoInfo'
    }
  },
  { $unwind: '$productoInfo' },
  {
    $group: {
      _id: '$productoInfo.categoria_id',
      compras: { $sum: 1 }
    }
  },
  { $sort: { compras: -1 } },
  { $limit: 2 },
  {
    $lookup: {
      from: 'productos',
      localField: '_id',
      foreignField: 'categoria_id',
      as: 'productosRecomendados'
    }
  },
  { $unwind: '$productosRecomendados' },
  {
    $match: {
      'productosRecomendados._id': {
        $nin: [
          // Lista de productos que el usuario ya ha comprado
        ]
      }
    }
  },
  { $limit: 5 },
  {
    $project: {
      _id: 0,
      nombre: '$productosRecomendados.nombre',
      precio: '$productosRecomendados.precio',
      id: '$productosRecomendados._id'
    }
  }
])
```

### 2. Sistema de búsqueda de texto completo

```javascript
// Crear índice para búsqueda de texto
db.productos.createIndex({
  nombre: 'text',
  descripcion: 'text'
})

// Buscar con puntuación de relevancia
db.productos
  .find({ $text: { $search: 'laptop smartphone portátil' } }, { score: { $meta: 'textScore' } })
  .sort({ score: { $meta: 'textScore' } })
```

### 3. Sistema de caché (pseudocódigo)

```javascript
// En una colección de caché
db.cache.findOneAndUpdate(
  { consulta: 'productos_populares' },
  {
    $set: {
      resultados: resultadosAgregacion,
      fechaActualizacion: new Date(),
      tiempoExpiracion: 3600 // 1 hora en segundos
    }
  },
  { upsert: true }
)

// Verificar caché
const cache = db.cache.findOne({ consulta: 'productos_populares' })
if (cache && new Date() - cache.fechaActualizacion < cache.tiempoExpiracion * 1000) {
  return cache.resultados
} else {
  // Ejecutar consulta y actualizar caché
}
```

### 4. Función para métricas de negocio

```javascript
// Crear función en MongoDB
db.system.js.insertOne({
  _id: 'calcularMetricasVentas',
  value: function (fechaInicio, fechaFin) {
    const metricas = db.pedidos
      .aggregate([
        {
          $match: {
            fecha: {
              $gte: fechaInicio,
              $lte: fechaFin
            }
          }
        },
        {
          $group: {
            _id: null,
            totalVentas: { $sum: '$total' },
            numeroPedidos: { $sum: 1 },
            ticketPromedio: { $avg: '$total' },
            pedidosCompletados: {
              $sum: { $cond: [{ $eq: ['$estado', 'Entregado'] }, 1, 0] }
            }
          }
        },
        {
          $project: {
            _id: 0,
            totalVentas: 1,
            numeroPedidos: 1,
            ticketPromedio: 1,
            pedidosCompletados: 1,
            tasaConversion: { $divide: ['$pedidosCompletados', '$numeroPedidos'] }
          }
        }
      ])
      .toArray()[0]

    return metricas
  }
})

// Uso
db.eval("calcularMetricasVentas(ISODate('2023-01-01'), ISODate('2023-03-31'))")
```

---

Este documento forma parte de la guía de estudio de bases de datos NoSQL.
