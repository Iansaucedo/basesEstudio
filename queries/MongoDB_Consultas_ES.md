# 📘 Guía de Consultas MongoDB

[🏠 Volver a la Guía de Estudio](../README_ES.md) | [📊 Agregaciones](./NoSQL_Aggregation_CheatSheet_ES.md) | [🕸 Operaciones Neo4j](./Neo4j_CRUD_ES.md) | [🛠 Guía Mongoose](../odm_ogm/Guia_Mongoose_ES.md)

Esta tabla resume todas las operaciones clave de MongoDB: CRUD, Agregaciones, Joins, Indexación y Upserts.

## Operaciones CRUD Básicas

| Categoría     | Operación                   | Propósito / Descripción                    | Ejemplo                                                                                         |
| ------------- | --------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| 📝 Crear      | `insertOne()`               | Insertar un solo documento                 | `db.users.insertOne({ name: "Ana", age: 28 })`                                                  |
|               | `insertMany()`              | Insertar múltiples documentos              | `db.users.insertMany([{ name: "Ana" }, { name: "Luis" }])`                                      |
| 📤 Leer       | `find()`                    | Encontrar documentos con condiciones       | `db.users.find({ age: { $gt: 25 } })`                                                           |
|               | `findOne()`                 | Encontrar un solo documento                | `db.users.findOne({ email: "ana@example.com" })`                                                |
| 🔧 Actualizar | `updateOne()`               | Actualizar el primer documento coincidente | `db.users.updateOne({ name: "Ana" }, { $set: { age: 30 } })`                                    |
|               | `updateMany()`              | Actualizar múltiples documentos            | `db.users.updateMany({ age: { $lt: 18 } }, { $set: { minor: true } })`                          |
|               | `upsert` (con `updateOne`)  | Actualizar o insertar si no se encuentra   | `db.users.updateOne({ email: "ana@example.com" }, { $set: { name: "Ana" } }, { upsert: true })` |
|               | `upsert` (con `updateMany`) | Insertar uno si ninguno coincide           | `db.logs.updateMany({ status: "new" }, { $set: { reviewed: false } }, { upsert: true })`        |
| ❌ Eliminar   | `deleteOne()`               | Eliminar el primer documento coincidente   | `db.users.deleteOne({ name: "Ana" })`                                                           |
|               | `deleteMany()`              | Eliminar múltiples documentos              | `db.users.deleteMany({ status: "inactive" })`                                                   |

## Operadores de Consulta

| Categoría      | Operador       | Propósito / Descripción            | Ejemplo                                                                 |
| -------------- | -------------- | ---------------------------------- | ----------------------------------------------------------------------- |
| 🔍 Comparación | `$eq`          | Igual a                            | `db.users.find({ age: { $eq: 30 } })`                                   |
|                | `$ne`          | No igual a                         | `db.users.find({ age: { $ne: 30 } })`                                   |
|                | `$gt` / `$gte` | Mayor que / Mayor o igual que      | `db.users.find({ age: { $gte: 18 } })`                                  |
|                | `$lt` / `$lte` | Menor que / Menor o igual que      | `db.users.find({ age: { $lt: 65 } })`                                   |
|                | `$in`          | En un array de valores             | `db.users.find({ status: { $in: ["active", "pending"] } })`             |
|                | `$nin`         | No en un array de valores          | `db.users.find({ status: { $nin: ["inactive", "banned"] } })`           |
| 🔄 Lógicos     | `$and`         | Y lógico                           | `db.users.find({ $and: [{ age: { $gt: 18 } }, { status: "active" }] })` |
|                | `$or`          | O lógico                           | `db.users.find({ $or: [{ age: { $lt: 18 } }, { age: { $gt: 65 } }] })`  |
|                | `$not`         | Negación                           | `db.users.find({ age: { $not: { $gt: 18 } } })`                         |
|                | `$nor`         | Ni uno ni otro                     | `db.users.find({ $nor: [{ status: "active" }, { age: { $lt: 18 } }] })` |
| 📚 Elementos   | `$exists`      | El campo existe                    | `db.users.find({ email: { $exists: true } })`                           |
|                | `$type`        | El campo es de un tipo específico  | `db.users.find({ age: { $type: "number" } })`                           |
| 📏 Evaluación  | `$regex`       | Coincide con una expresión regular | `db.users.find({ name: { $regex: /^A/, $options: "i" } })`              |
|                | `$expr`        | Expresiones agregadas              | `db.users.find({ $expr: { $gt: ["$balance", "$debt"] } })`              |
|                | `$jsonSchema`  | Validar con JSON Schema            | `db.users.find({ $jsonSchema: { required: ["name", "email"] } })`       |

## Operaciones de Agregación

| Categoría   | Operador           | Propósito / Descripción     | Ejemplo                                                                                                                     |
| ----------- | ------------------ | --------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 🔄 Pipeline | `$match`           | Filtrar documentos          | `db.orders.aggregate([{ $match: { status: "completed" } }])`                                                                |
|             | `$project`         | Seleccionar o crear campos  | `db.users.aggregate([{ $project: { fullName: { $concat: ["$firstName", " ", "$lastName"] }, _id: 0 } }])`                   |
|             | `$group`           | Agrupar por campo y agregar | `db.sales.aggregate([{ $group: { _id: "$region", total: { $sum: "$amount" } } }])`                                          |
|             | `$sort`            | Ordenar resultados          | `db.users.aggregate([{ $sort: { age: -1 } }])`                                                                              |
|             | `$limit` / `$skip` | Limitar o saltar resultados | `db.users.aggregate([{ $skip: 10 }, { $limit: 5 }])`                                                                        |
| 🔄 Joins    | `$lookup`          | Join con otra colección     | `db.orders.aggregate([{ $lookup: { from: "customers", localField: "customer_id", foreignField: "_id", as: "customer" } }])` |
|             | `$unwind`          | Descomponer arrays          | `db.orders.aggregate([{ $lookup: {...} }, { $unwind: "$customer" }])`                                                       |
| 🧮 Cálculos | `$sum`             | Sumar valores               | `db.sales.aggregate([{ $group: { _id: "$region", total: { $sum: "$amount" } } }])`                                          |
|             | `$avg`             | Calcular promedio           | `db.sales.aggregate([{ $group: { _id: "$product", avgPrice: { $avg: "$price" } } }])`                                       |
|             | `$min` / `$max`    | Valor mínimo / máximo       | `db.users.aggregate([{ $group: { _id: "$department", oldest: { $max: "$age" } } }])`                                        |
|             | `$count`           | Contar documentos           | `db.users.aggregate([{ $count: "active_users" }])`                                                                          |

## Manejo Avanzado de Datos

| Categoría     | Operación                  | Propósito / Descripción                  | Ejemplo                                                                                                                                                                      |
| ------------- | -------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 📈 Indexación | `createIndex()`            | Crear un índice                          | `db.users.createIndex({ email: 1 }, { unique: true })`                                                                                                                       |
|               | `dropIndex()`              | Eliminar un índice                       | `db.users.dropIndex("email_1")`                                                                                                                                              |
| 🔗 Relaciones | `$lookup`                  | Join basado en campos relacionados       | `db.orders.aggregate([{ $lookup: { from: "products", localField: "product_id", foreignField: "_id", as: "product" } }])`                                                     |
|               | `$graphLookup`             | Búsqueda recursiva (grafo)               | `db.employees.aggregate([{ $graphLookup: { from: "employees", startWith: "$reportsTo", connectFromField: "reportsTo", connectToField: "_id", as: "reportingHierarchy" } }])` |
| 📊 Análisis   | `mapReduce()`              | Operaciones de mapeo-reducción complejas | `db.sales.mapReduce(map, reduce, { out: "sales_results" })`                                                                                                                  |
|               | `db.collection.distinct()` | Valores distintos de un campo            | `db.users.distinct("status")`                                                                                                                                                |
| 🧹 Gestión    | `drop()`                   | Eliminar colección                       | `db.oldCollection.drop()`                                                                                                                                                    |
|               | `createCollection()`       | Crear colección                          | `db.createCollection("newCollection", { capped: true, size: 1048576 })`                                                                                                      |

## Ejemplos de Patrones Comunes

### Paginación de Resultados

```javascript
const page = 2
const pageSize = 20
db.products
  .find()
  .skip((page - 1) * pageSize)
  .limit(pageSize)
```

### Búsqueda por Texto

```javascript
// Primero crear un índice de texto
db.articles.createIndex({ title: 'text', content: 'text' })
// Luego buscar
db.articles.find({ $text: { $search: 'mongodb nosql' } })
```

### Transacciones

```javascript
const session = db.getMongo().startSession()
session.startTransaction()

try {
  // Operaciones dentro de la transacción
  session.getDatabase('mydb').users.updateOne({ _id: userId }, { $inc: { balance: -100 } })

  session.getDatabase('mydb').accounts.updateOne({ _id: accountId }, { $inc: { balance: 100 } })

  session.commitTransaction()
} catch (error) {
  session.abortTransaction()
  throw error
} finally {
  session.endSession()
}
```

---

Este documento es parte de la guía de estudio de bases de datos NoSQL.
