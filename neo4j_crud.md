
# 🧠 Guía de Código: CRUD en Neo4j con JavaScript Driver

Este documento muestra cómo realizar operaciones CRUD directamente usando el Neo4j Driver en JavaScript, sin frameworks ni configuración de entorno. Incluye también un ejemplo completo de cómo recibir un JSON y crear nodos y relaciones.

---

## 🔌 Conexión al Driver

```js
const neo4j = require("neo4j-driver");

const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "password")
);
```

---

## ✅ CREATE (Crear nodo)

```js
const session = driver.session();

await session.run(\`
  CREATE (u:Usuario {nombre: $nombre, edad: $edad})
\`, {
  nombre: "Juan",
  edad: 30
});

await session.close();
```

---

## 📥 READ (Leer nodos)

```js
const session = driver.session();

const result = await session.run(\`
  MATCH (u:Usuario)
  RETURN u
\`);

const usuarios = result.records.map(record => record.get("u").properties);

console.log(usuarios);

await session.close();
```

---

## 📝 UPDATE (Actualizar nodo)

```js
const session = driver.session();

await session.run(\`
  MATCH (u:Usuario {nombre: $nombre})
  SET u.edad = $nuevaEdad
\`, {
  nombre: "Juan",
  nuevaEdad: 35
});

await session.close();
```

---

## ❌ DELETE (Eliminar nodo)

```js
const session = driver.session();

await session.run(\`
  MATCH (u:Usuario {nombre: $nombre})
  DELETE u
\`, {
  nombre: "Juan"
});

await session.close();
```

---

## 🔁 Relaciones (Opcional)

### Crear una relación

```js
const session = driver.session();

await session.run(\`
  MATCH (a:Alumno {nombre: $alumno}), (c:Curso {nombre: $curso})
  CREATE (a)-[:INSCRITO_EN]->(c)
\`, {
  alumno: "Ana",
  curso: "Bases de Datos"
});

await session.close();
```

---

## ✅ Ejemplo completo: Crear nodos y relaciones desde JSON

```js
const neo4j = require("neo4j-driver");

const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "password")
);

async function crearDesdeJson(jsonData) {
  const session = driver.session();
  try {
    const { alumno, curso } = jsonData;

    await session.writeTransaction(async tx => {
      await tx.run(\`
        MERGE (a:Alumno {id: $alumnoId})
        SET a.nombre = $alumnoNombre

        MERGE (c:Curso {codigo: $cursoCodigo})
        SET c.nombre = $cursoNombre

        MERGE (a)-[:INSCRITO_EN]->(c)
      \`, {
        alumnoId: alumno.id,
        alumnoNombre: alumno.nombre,
        cursoCodigo: curso.codigo,
        cursoNombre: curso.nombre
      });
    });

    console.log("Nodos y relación creados");
  } finally {
    await session.close();
  }
}

// JSON de ejemplo
const datos = {
  alumno: {
    id: "A001",
    nombre: "Lucía"
  },
  curso: {
    codigo: "BD101",
    nombre: "Bases de Datos"
  }
};

crearDesdeJson(datos)
  .then(() => driver.close())
  .catch(error => console.error(error));
```

---

## 🧼 Cierre del driver

```js
await driver.close();
```

---

## 🧪 Notas

- Usa `MERGE` para evitar duplicados.
- `.get("alias").properties` accede a los datos de un nodo.
- Siempre cierra `session` y `driver` cuando termines.
