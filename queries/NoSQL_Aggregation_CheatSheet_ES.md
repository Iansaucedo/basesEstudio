# 📘 Guía de Referencia de Agregación NoSQL (MongoDB y Neo4j)

Esta guía proporciona una referencia rápida comparando operadores de **SQL**, **MongoDB Aggregation Framework** y **Neo4j Cypher** con ejemplos.

---

## 📦 Operadores de Agregación MongoDB – Equivalentes SQL

| SQL Equivalente   | Operador MongoDB               | Descripción                                | Ejemplo MongoDB                                                                                                     |
| ----------------- | ------------------------------ | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `SELECT`          | `$project`                     | Seleccionar campos específicos             | `db.users.aggregate([{ $project: { name: 1, age: 1, _id: 0 } }])`                                                   |
| `WHERE`           | `$match`                       | Filtrar documentos basado en una condición | `db.users.aggregate([{ $match: { age: { $gt: 18 } } }])`                                                            |
| `GROUP BY`        | `$group`                       | Agrupar documentos y agregar datos         | `db.users.aggregate([{ $group: { _id: "$dept", total: { $sum: 1 } } }])`                                            |
| `ORDER BY`        | `$sort`                        | Ordenar documentos                         | `db.users.aggregate([{ $sort: { age: -1 } }])`                                                                      |
| `LIMIT`           | `$limit`                       | Limitar número de resultados               | `db.users.aggregate([{ $limit: 10 }])`                                                                              |
| `OFFSET` / `SKIP` | `$skip`                        | Saltar un número de documentos             | `db.users.aggregate([{ $skip: 5 }])`                                                                                |
| `HAVING`          | `$match` (después de `$group`) | Filtrar después de agrupar                 | `db.users.aggregate([{ $group: { _id: "$dept", total: { $sum: 1 } } }, { $match: { total: { $gt: 10 } } }])`        |
| `JOIN`            | `$lookup`                      | Unir con otra colección                    | `db.orders.aggregate([{ $lookup: { from: "users", localField: "user_id", foreignField: "id", as: "user_info" } }])` |
| `UNION`           | `$unionWith`                   | Combinar múltiples colecciones             | `db.sales.aggregate([{ $unionWith: { coll: "returns", pipeline: [] } }])`                                           |
| `COUNT(*)`        | `$count`                       | Contar documentos                          | `db.users.aggregate([{ $count: "total_users" }])`                                                                   |
| `SUM()`           | `$sum`                         | Calcular suma                              | `db.orders.aggregate([{ $group: { _id: null, total: { $sum: "$price" } } }])`                                       |
| `AVG()`           | `$avg`                         | Calcular promedio                          | `db.users.aggregate([{ $group: { _id: "$dept", avgAge: { $avg: "$age" } } }])`                                      |
| `MIN()`           | `$min`                         | Valor mínimo                               | `db.users.aggregate([{ $group: { _id: "$dept", minAge: { $min: "$age" } } }])`                                      |
| `MAX()`           | `$max`                         | Valor máximo                               | `db.users.aggregate([{ $group: { _id: "$dept", maxAge: { $max: "$age" } } }])`                                      |

---

## 🧠 Operadores Cypher Neo4j – Equivalentes SQL

| SQL Equivalente   | Operador Cypher   | Descripción                                | Ejemplo Cypher                                                                                                                                     |
| ----------------- | ----------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SELECT`          | `RETURN`          | Devolver campos específicos                | `MATCH (p:Person) RETURN p.name, p.age`                                                                                                            |
| `WHERE`           | `WHERE`           | Filtrar nodos/relaciones                   | `MATCH (p:Person) WHERE p.age > 30 RETURN p`                                                                                                       |
| `GROUP BY`        | `WITH ... RETURN` | Agrupar y agregar                          | `MATCH (p:Person) WITH p.city AS city, count(*) AS total RETURN city, total`                                                                       |
| `ORDER BY`        | `ORDER BY`        | Ordenar resultados                         | `MATCH (p:Person) RETURN p.name ORDER BY p.age DESC`                                                                                               |
| `LIMIT`           | `LIMIT`           | Limitar número de resultados               | `MATCH (p:Person) RETURN p.name LIMIT 5`                                                                                                           |
| `OFFSET` / `SKIP` | `SKIP`            | Saltar un número de resultados             | `MATCH (p:Person) RETURN p.name SKIP 5`                                                                                                            |
| `HAVING`          | `WITH ... WHERE`  | Filtrar después de agregación              | `MATCH (p:Person) WITH p.city AS city, count(*) AS c WHERE c > 10 RETURN city, c`                                                                  |
| `JOIN`            | Pattern Matching  | Atravesar relaciones                       | `MATCH (a:Author)-[:WROTE]->(b:Book) RETURN a.name, b.title`                                                                                       |
| `UNION`           | `UNION`           | Combinar resultados de múltiples consultas | `MATCH (s:Student)-[:IN]->(:Department {name: 'Math'}) RETURN s.name UNION MATCH (s:Student)-[:IN]->(:Department {name: 'Physics'}) RETURN s.name` |
| `COUNT(*)`        | `count(*)`        | Contar nodos o patrones                    | `MATCH (p:Person) RETURN count(p)`                                                                                                                 |
| `SUM()`           | `sum()`           | Sumar valores                              | `MATCH (p:Person) RETURN sum(p.age)`                                                                                                               |
| `AVG()`           | `avg()`           | Calcular promedio                          | `MATCH (p:Person) RETURN avg(p.age)`                                                                                                               |
| `MIN()`           | `min()`           | Valor mínimo                               | `MATCH (p:Person) RETURN min(p.age)`                                                                                                               |
| `MAX()`           | `max()`           | Valor máximo                               | `MATCH (p:Person) RETURN max(p.age)`                                                                                                               |

---
