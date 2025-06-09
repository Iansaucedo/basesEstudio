# Ejercicios de Completar Espacios sobre Neo4j y OGM

En los siguientes ejercicios, deberás completar los espacios en blanco para que el código funcione correctamente.

## Conexión y Operaciones Básicas

### 1. Conexión a Neo4j

> Completa los espacios en blanco para establecer una conexión a la base de datos Neo4j.

```javascript
import neo4j from 'neo4j-driver'
;(async () => {
  const URI = '______' // URI de conexión
  const USER = '______' // Usuario de la base de datos
  const PASSWORD = '______' // Contraseña de la base de datos
  let driver

  try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))
    const serverInfo = await driver.getServerInfo()
    console.log('Connection established')
    console.log(serverInfo)
  } catch (err) {
    console.log(`Connection error\n${err}\nCause: ${err.cause}`)
  }
})()
```

### 2. Crear una función de conexión reutilizable

> Completa los espacios en blanco para crear una función que devuelva una conexión a Neo4j.

```javascript
import neo4j from 'neo4j-driver'

function conectarNeo4j() {
  const URI = 'neo4j://localhost:7687'
  const USER = 'neo4j'
  const PASSWORD = 'password'

  try {
    const driver = neo4j._______(URI, neo4j.auth._______(USER, PASSWORD))
    console.log('Driver creado')
    return _______
  } catch (err) {
    console.error(`Error al crear driver: ${err}`)
    throw err
  }
}
```

## Operaciones CRUD

### 3. Crear un nodo (CREATE)

> Completa los espacios en blanco para crear un nodo de tipo jugador con año y lugar de nacimiento.

```javascript
const { records, summary, keys } = await driver.executeQuery(
  'CREATE (Dhawan:player{name: "Shikar Dhawan", YOB: ______, POB: "______"}) ',
  { database: 'test' }
)
```

### 4. Crear múltiples nodos con parámetros

> Completa los espacios en blanco para definir un nodo tipo Person con todos sus parámetros.

```javascript
const { records, summary, keys } = await driver.executeQuery(
  'UNWIND $props AS map CREATE (n:Person) SET n = map',
  {
    props: [
      {
        name: '______',
        twitter: '______',
        yearsExperience: ______,
        birthdate: '______'
      }
      // otros nodos...
    ]
  },
  { database: 'laboral1' }
)
```

### 5. Leer datos (READ)

> Completa los espacios en blanco para consultar y mostrar los nombres de las personas almacenadas.

```javascript
const { records, summary, keys } = await driver.executeQuery(
  'MATCH (n:Person) RETURN n.______ AS ______',
  { database: 'test' }
)

records.forEach(record => {
  console.log(record.get('______'))
})
```

### 6. Actualizar un nodo (UPDATE)

> Completa los espacios en blanco para actualizar el campo twitter de una persona llamada Melissa.

```javascript
const { records, summary, keys } = await driver.executeQuery(
  'MATCH (n:Person {name: $name}) SET n.twitter = $______ RETURN n',
  { name: 'Melissa', twitter: '______' },
  { database: 'laboral1' }
)
```

### 7. Eliminar un nodo (DELETE)

> Completa los espacios en blanco para eliminar una persona llamada Dan.

```javascript
const { records, summary, keys } = await driver.executeQuery(
  'MATCH (n:Person {name: $______}) DELETE n',
  { name: '______' },
  { database: 'laboral1' }
)
```

## Relaciones y Consultas Avanzadas

### 8. Crear una relación entre dos nodos

> Completa los espacios en blanco para crear una relación KNOWS entre dos personas.

```javascript
const { records } = await driver.executeQuery(
  'MATCH (a:Person {name: $nameA}), (b:Person {name: $nameB}) ' +
    'CREATE (a)-[r:_______ {since: $year}]->(b) ' +
    'RETURN a, b, r',
  { nameA: 'Alice', nameB: '______', year: ______ },
  { database: 'social' }
)
```

### 9. Consulta con filtros y ordenamiento

> Completa los espacios en blanco para buscar personas que vivan en cierta ciudad y ordenarlas por edad.

```javascript
const { records } = await driver.executeQuery(
  'MATCH (p:Person) ' +
    'WHERE p.city = $______ ' +
    'RETURN p.name, p.age ' +
    'ORDER BY p.______ ______',
  { city: 'Madrid' },
  { database: 'social' }
)
```

### 10. Consulta de relaciones con profundidad variable

> Completa los espacios en blanco para encontrar amigos de amigos hasta 3 niveles de profundidad.

```javascript
const { records } = await driver.executeQuery(
  'MATCH (p:Person {name: $name})-[r:KNOWS*______]->(friend) ' +
    'WHERE friend.name <> $name ' +
    'RETURN DISTINCT friend.name',
  { name: 'John' },
  { database: 'social' }
)
```

## Gestión de Sesiones y Transacciones

### 11. Crear y cerrar una sesión

> Completa los espacios en blanco para crear y cerrar una sesión correctamente.

```javascript
const driver = conectarNeo4j()
const session = driver.______()

try {
  // Operaciones con la sesión...
  const result = await session.run('MATCH (n) RETURN count(n) as count')
  console.log(`Número de nodos: ${result.records[0].get('count')}`)
} finally {
  await session.______()
  await driver.close()
}
```

### 12. Ejecutar una transacción

> Completa los espacios en blanco para ejecutar varias operaciones en una transacción.

```javascript
const session = driver.session()

try {
  const result = await session._______(async tx => {
    // Primera operación
    await tx.run('CREATE (n:Person {name: $name})', { name: 'Alice' })

    // Segunda operación
    return await tx.run('MATCH (n:Person) RETURN count(n) as count')
  })

  console.log(`Número de personas: ${result.records[0].get('______')}`)
} finally {
  await session.close()
}
```

## Manejo de Errores y Cierre de Conexiones

### 13. Manejo de errores en consultas

> Completa los espacios en blanco para manejar apropiadamente los errores en una consulta.

```javascript
async function ejecutarConsulta(query, params) {
  const session = driver.session()

  try {
    return await session.run(query, params)
  } catch (error) {
    console.error(`Error en la consulta: ${______}`)
    throw ______
  } finally {
    await ______.close()
  }
}
```

### 14. Cerrar la conexión

> Completa el espacio en blanco para cerrar correctamente la conexión a la base de datos.

```javascript
// Código para operaciones en la base de datos...

// Al finalizar las operaciones:
await ______.close()
```

### 15. Configuración avanzada del driver

> Completa los espacios en blanco para configurar opciones avanzadas del driver.

```javascript
const driver = neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic('neo4j', 'password'), {
  maxConnectionPoolSize: ______,
  connectionAcquisitionTimeout: ______, // milisegundos
  logging: {
    level: '______', // 'debug', 'info', 'warn', or 'error'
    logger: (level, message) => console.log(`${level}: ${message}`)
  }
})
```
