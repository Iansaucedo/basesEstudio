# 🕸 Neo4j CheatSheet - Comandos Esenciales en Cypher

[🏠 Volver a la Guía de Estudio](../README_ES.md) | [📊 CRUD en Neo4j](./Neo4j_CRUD_ES.md) | [🛠 Neo4j OGM](../odm_ogm/OGM_Neo4j_Guia_ES.md)

Esta hoja de referencia rápida contiene los comandos Cypher más utilizados en Neo4j para operaciones comunes.

---

## 📌 Conceptos Básicos

### 🔍 Entidades de Neo4j

- **Nodo**: Entidad principal (persona, producto, etc.)
- **Etiqueta**: Categorización de nodos (`Person`, `Product`)
- **Propiedad**: Atributos de nodos y relaciones
- **Relación**: Conexiones entre nodos
- **Tipo de Relación**: Categorización de relaciones (`FOLLOWS`, `PURCHASED`)

---

## 🔍 MATCH: Consultas Básicas

### Encontrar todos los nodos con una etiqueta

```cypher
MATCH (p:Person)
RETURN p
LIMIT 25
```

### Encontrar un nodo por una propiedad

```cypher
MATCH (p:Person {name: 'Ana'})
RETURN p
```

### Filtrar con WHERE

```cypher
MATCH (p:Person)
WHERE p.age > 30
RETURN p.name, p.age
ORDER BY p.age DESC
```

### Operadores de comparación

```cypher
// Mayor, menor, igual
WHERE p.age > 25
WHERE p.price <= 100
WHERE p.status <> 'Inactive'

// Texto
WHERE p.name STARTS WITH 'A'
WHERE p.description CONTAINS 'premium'
WHERE p.code ENDS WITH '123'

// Booleanos
WHERE exists(p.email)
WHERE NOT exists(p.deleted)

// Colecciones
WHERE p.name IN ['Ana', 'Luis', 'Carlos']
WHERE size(p.roles) > 0
```

## 📝 CREATE: Crear Datos

### Crear un nodo simple

```cypher
CREATE (p:Person {name: 'Ana', age: 28})
```

### Crear un nodo con múltiples etiquetas

```cypher
CREATE (p:Person:Employee {
  name: 'Luis',
  age: 32,
  department: 'IT'
})
```

### Crear múltiples nodos

```cypher
CREATE
  (a:Person {name: 'Ana', age: 28}),
  (b:Person {name: 'Carlos', age: 35})
```

### Crear una relación entre nodos existentes

```cypher
MATCH (a:Person {name: 'Ana'}), (b:Person {name: 'Carlos'})
CREATE (a)-[r:KNOWS {since: '2023-01-15'}]->(b)
```

### Crear nodos y relación en una consulta

```cypher
CREATE (a:Person {name: 'Elena'})-[r:WORKS_AT]->(c:Company {name: 'ABC Corp'})
```

## 🔧 SET/REMOVE: Actualizar Datos

### Modificar propiedades

```cypher
MATCH (p:Person {name: 'Ana'})
SET p.age = 29, p.updated = timestamp()
```

### Agregar etiquetas

```cypher
MATCH (p:Person {name: 'Ana'})
SET p:Customer
```

### Reemplazar todas las propiedades

```cypher
MATCH (p:Person {name: 'Ana'})
SET p = {name: 'Ana Rodríguez', age: 29, email: 'ana@example.com'}
```

### Actualizar propiedades de manera condicional

```cypher
MATCH (p:Person)
SET p.status = CASE WHEN p.age < 18 THEN 'Minor' ELSE 'Adult' END
```

### Eliminar propiedad

```cypher
MATCH (p:Person {name: 'Ana'})
REMOVE p.temporaryField
```

### Eliminar etiqueta

```cypher
MATCH (p:Person {name: 'Ana'})
REMOVE p:TemporaryLabel
```

## ❌ DELETE: Eliminar Datos

### Eliminar nodos específicos

```cypher
MATCH (p:Person {name: 'Ana'})
DELETE p
```

### Eliminar nodos y sus relaciones (DETACH DELETE)

```cypher
MATCH (p:Person {status: 'Inactive'})
DETACH DELETE p
```

### Eliminar solo relaciones

```cypher
MATCH (a:Person)-[r:FOLLOWS]->(b:Person)
WHERE r.since < '2022-01-01'
DELETE r
```

## 🔄 MERGE: Crear o Actualizar

### Crear nodo si no existe, encontrarlo si existe

```cypher
MERGE (p:Person {email: 'ana@example.com'})
ON CREATE SET p.name = 'Ana Nueva', p.createdAt = timestamp()
ON MATCH SET p.lastLogin = timestamp()
```

### MERGE para relaciones únicas

```cypher
MATCH (a:Person {email: 'ana@example.com'}), (b:Person {email: 'carlos@example.com'})
MERGE (a)-[r:KNOWS]->(b)
```

## 🔄 Relaciones

### Buscar relaciones entrantes

```cypher
MATCH (p:Person)<-[r:FOLLOWS]-(follower)
RETURN p.name, count(follower) as followersCount
```

### Buscar relaciones salientes

```cypher
MATCH (p:Person {name: 'Ana'})-[r:FOLLOWS]->(followed)
RETURN followed.name
```

### Relaciones sin dirección específica

```cypher
MATCH (a:Person)-[r:FRIENDS]-(b:Person)
RETURN a.name, b.name
```

### Relación con comodín

```cypher
// Cualquier tipo de relación
MATCH (a:Person)-[r]->(b)
RETURN a.name, type(r), b.name

// Múltiples tipos de relaciones
MATCH (a:Person)-[r:FOLLOWS|KNOWS]->(b:Person)
RETURN a.name, type(r), b.name
```

### Relaciones múltiples (caminos)

```cypher
// Amigos de amigos
MATCH (p:Person {name: 'Ana'})-[:FRIENDS]->()-[:FRIENDS]->(fof)
RETURN DISTINCT fof.name
```

### Relaciones con longitud variable

```cypher
// Conexiones de 1 a 3 pasos de distancia
MATCH (p:Person {name: 'Ana'})-[:KNOWS*1..3]->(connection)
RETURN connection.name
```

## 🔡 Funciones de Manipulación

### Texto

```cypher
RETURN toUpper('texto') // TEXTO
RETURN toLower('TEXTO') // texto
RETURN substring('abcdef', 2, 3) // cde
RETURN replace('Neo4j es rápido', 'rápido', 'potente')
```

### Numéricos

```cypher
RETURN round(3.141592) // 3
RETURN ceil(3.14) // 4
RETURN floor(3.74) // 3
RETURN abs(-5) // 5
RETURN rand() // Número aleatorio entre 0 y 1
```

### Fechas y Tiempo

```cypher
RETURN date() // Fecha actual
RETURN datetime() // Fecha y hora actual
RETURN timestamp() // Milisegundos desde epoch
RETURN duration.between(date('2023-01-01'), date()) // Duración
```

### Conversiones

```cypher
RETURN toInteger('123')
RETURN toString(123)
RETURN toBoolean('true')
```

## 📊 Funciones de Agregación

### Básicas

```cypher
MATCH (p:Product)
RETURN
  count(p) as total,
  avg(p.price) as precioPromedio,
  min(p.price) as precioMinimo,
  max(p.price) as precioMaximo,
  sum(p.price) as precioTotal
```

### Agrupamiento

```cypher
MATCH (p:Product)-[:IN_CATEGORY]->(c:Category)
RETURN
  c.name as categoria,
  count(p) as productos,
  avg(p.price) as precioPromedio
ORDER BY productos DESC
```

## 📅 Indexación

### Crear índices

```cypher
// Indice simple para búsqueda rápida
CREATE INDEX person_email IF NOT EXISTS
FOR (p:Person) ON (p.email)

// Índice único (restricción)
CREATE CONSTRAINT person_email_unique IF NOT EXISTS
FOR (p:Person) ON (p.email)
ASSERT p.email IS UNIQUE

// Índice compuesto
CREATE INDEX person_name_age IF NOT EXISTS
FOR (p:Person) ON (p.name, p.age)
```

### Eliminar índices

```cypher
DROP INDEX person_email
DROP CONSTRAINT person_email_unique
```

## 🧬 Algoritmos de Grafos (Requiere GDS Library)

### Camino más corto

```cypher
MATCH (a:Person {name: 'Ana'}), (b:Person {name: 'Carlos'})
CALL gds.shortestPath.dijkstra.stream({
  sourceNode: a,
  targetNode: b,
  relationshipWeightProperty: 'distance'
})
YIELD nodeIds, costs
RETURN nodeIds, costs
```

### Centralidad (PageRank)

```cypher
CALL gds.pageRank.stream('my-graph')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS name, score
ORDER BY score DESC
```

### Detección de comunidades

```cypher
CALL gds.louvain.stream('my-graph')
YIELD nodeId, communityId
RETURN gds.util.asNode(nodeId).name AS name, communityId
ORDER BY communityId
```

## 🧩 Patrones Comunes

### Paginación

```cypher
MATCH (p:Product)
RETURN p
ORDER BY p.name
SKIP 20  // Saltar los primeros 20 resultados
LIMIT 10 // Mostrar solo 10 resultados
```

### Búsqueda por texto

```cypher
// Crear un índice de texto
CREATE FULLTEXT INDEX product_search IF NOT EXISTS
FOR (p:Product) ON EACH [p.name, p.description]

// Usar búsqueda de texto
CALL db.index.fulltext.queryNodes("product_search", "smartphone premium")
YIELD node, score
RETURN node.name, score
```

### Consulta parametrizada (para aplicaciones)

```cypher
// En aplicaciones, usar parámetros para evitar inyección Cypher
MATCH (p:Person)
WHERE p.name = $name
RETURN p
// Pasar {name: 'Ana'} como parámetro
```

---

## 🛠 Comandos de Administración

### Información del sistema

```cypher
CALL dbms.components() // Versión de Neo4j y componentes
CALL db.schema.visualization() // Visualización del esquema
CALL db.labels() // Ver todas las etiquetas
CALL db.relationshipTypes() // Ver todos los tipos de relaciones
```

### Gestión de restricciones e índices

```cypher
SHOW INDEXES // Mostrar todos los índices
SHOW CONSTRAINTS // Mostrar todas las restricciones
```

---

Esta cheatsheet está diseñada para consulta rápida. Para ejemplos más detallados y explicaciones, consulta la [Guía CRUD de Neo4j](./Neo4j_CRUD_ES.md) o la [Guía OGM](../odm_ogm/OGM_Neo4j_Guia_ES.md).
