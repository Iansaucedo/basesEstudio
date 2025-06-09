# 🕸 Guía de OGM con Neo4j para Node.js

[🏠 Volver a la Guía de Estudio](../README_ES.md) | [📊 Consultas Neo4j](../queries/Neo4j_CRUD_ES.md) | [🛠 ODM/OGM General](./ODM_OGM_Guia_ES.md) | [📗 Guía Mongoose](./Guia_Mongoose_ES.md)

Esta guía se centra específicamente en el uso de **Neo4j Driver** como OGM (Object Graph Mapper) para bases de datos de grafos Neo4j en aplicaciones Node.js.

---

## 📦 Configuración e Instalación

### 🔧 Instalación del Driver

```bash
npm install neo4j-driver
```

### 🔗 Establecer Conexión

```js
const neo4j = require('neo4j-driver')

// Crear instancia del driver
const driver = neo4j.driver(
  'bolt://localhost:7687', // URI de conexión
  neo4j.auth.basic('neo4j', 'password') // Autenticación
)

// Para aplicaciones de producción, considera configuraciones adicionales:
const driverConfigAvanzada = neo4j.driver(
  'neo4j://localhost:7687', // URI con balanceo de carga (cluster)
  neo4j.auth.basic('neo4j', 'password'),
  {
    maxConnectionPoolSize: 50,
    maxTransactionRetryTime: 30000,
    connectionTimeout: 5000
  }
)

// Crear una sesión para ejecutar consultas
const session = driver.session()
```

## 📊 Gestión de Sesiones y Transacciones

### Sesiones Básicas

```js
// Manera moderna de trabajar con sesiones (auto-cierre)
const ejecutarConsulta = async () => {
  const session = driver.session()
  try {
    const result = await session.run('MATCH (n) RETURN count(n) as count')
    const count = result.records[0].get('count').toNumber()
    console.log(`Base de datos contiene ${count} nodos`)
    return count
  } finally {
    // Siempre cerrar la sesión
    await session.close()
  }
}
```

### Transacciones Explícitas

```js
const ejecutarTransaccion = async () => {
  const session = driver.session()

  // Iniciar transacción explícita
  const tx = session.beginTransaction()

  try {
    // Múltiples operaciones dentro de la misma transacción
    await tx.run('CREATE (p:Producto {id: $id, nombre: $nombre, precio: $precio})', {
      id: 'prod-123',
      nombre: 'Laptop',
      precio: 1299
    })

    await tx.run('CREATE (c:Categoria {nombre: $nombre})', { nombre: 'Electrónica' })

    // Relacionar ambas entidades
    await tx.run(
      `MATCH (p:Producto {id: $prodId}) 
       MATCH (c:Categoria {nombre: $catNombre})
       CREATE (p)-[r:PERTENECE_A]->(c)
       RETURN r`,
      { prodId: 'prod-123', catNombre: 'Electrónica' }
    )

    // Confirmar la transacción
    await tx.commit()
    console.log('Transacción completada exitosamente')
  } catch (error) {
    // Revertir en caso de error
    await tx.rollback()
    console.error('Error en la transacción:', error)
    throw error
  } finally {
    // Cerrar la sesión
    await session.close()
  }
}
```

## 🔍 Operaciones CRUD Básicas

### Crear Nodos

```js
const crearUsuario = async usuario => {
  const session = driver.session()
  try {
    const result = await session.run(
      `CREATE (u:Usuario {
        id: $id,
        nombre: $nombre,
        email: $email,
        edad: $edad,
        fechaRegistro: $fechaRegistro
      }) RETURN u`,
      {
        id: usuario.id || crypto.randomUUID(),
        nombre: usuario.nombre,
        email: usuario.email,
        edad: usuario.edad,
        fechaRegistro: new Date().toISOString()
      }
    )

    return result.records[0].get('u').properties
  } finally {
    await session.close()
  }
}
```

### Leer Nodos

```js
// Buscar un único nodo
const buscarUsuarioPorEmail = async email => {
  const session = driver.session()
  try {
    const result = await session.run('MATCH (u:Usuario {email: $email}) RETURN u', { email })

    if (result.records.length === 0) {
      return null
    }

    return result.records[0].get('u').properties
  } finally {
    await session.close()
  }
}

// Buscar múltiples nodos con filtros
const buscarUsuarios = async (filtros = {}) => {
  const session = driver.session()

  try {
    // Construir condiciones dinámicamente
    let condiciones = []
    let parametros = {}

    if (filtros.edadMinima) {
      condiciones.push('u.edad >= $edadMinima')
      parametros.edadMinima = filtros.edadMinima
    }

    if (filtros.edadMaxima) {
      condiciones.push('u.edad <= $edadMaxima')
      parametros.edadMaxima = filtros.edadMaxima
    }

    // Crear cláusula WHERE si hay condiciones
    const whereClause = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : ''

    const query = `
      MATCH (u:Usuario)
      ${whereClause}
      RETURN u
      ORDER BY u.nombre
      LIMIT $limit
    `

    const result = await session.run(query, { ...parametros, limit: filtros.limit || 25 })

    return result.records.map(record => record.get('u').properties)
  } finally {
    await session.close()
  }
}
```

### Actualizar Nodos

```js
// Actualizar un nodo
const actualizarUsuario = async (email, actualizaciones) => {
  const session = driver.session()

  try {
    // Construir sentencias SET dinámicamente
    const setStatements = Object.entries(actualizaciones)
      .map(([key, _]) => `u.${key} = $${key}`)
      .join(', ')

    if (!setStatements) {
      throw new Error('No se proporcionaron campos para actualizar')
    }

    const query = `
      MATCH (u:Usuario {email: $email})
      SET ${setStatements}
      RETURN u
    `

    const result = await session.run(query, { email, ...actualizaciones })

    if (result.records.length === 0) {
      return null
    }

    return result.records[0].get('u').properties
  } finally {
    await session.close()
  }
}
```

### Eliminar Nodos

```js
// Eliminar un nodo
const eliminarUsuario = async email => {
  const session = driver.session()

  try {
    const result = await session.run(
      'MATCH (u:Usuario {email: $email}) DELETE u RETURN count(u) as deleted',
      { email }
    )

    return result.records[0].get('deleted').toNumber() > 0
  } finally {
    await session.close()
  }
}

// Eliminar un nodo y todas sus relaciones
const eliminarUsuarioCompleto = async email => {
  const session = driver.session()

  try {
    const result = await session.run(
      'MATCH (u:Usuario {email: $email}) DETACH DELETE u RETURN count(u) as deleted',
      { email }
    )

    return result.records[0].get('deleted').toNumber() > 0
  } finally {
    await session.close()
  }
}
```

## 🔄 Gestión de Relaciones

### Crear Relaciones

```js
// Crear una relación entre dos nodos
const crearAmistad = async (email1, email2, desde = new Date().toISOString()) => {
  const session = driver.session()

  try {
    const result = await session.run(
      `MATCH (u1:Usuario {email: $email1})
       MATCH (u2:Usuario {email: $email2})
       CREATE (u1)-[r:AMIGO_DE {desde: $desde}]->(u2)
       RETURN r`,
      { email1, email2, desde }
    )

    if (result.records.length === 0) {
      throw new Error('No se pudo crear la relación. Verifique que ambos usuarios existan.')
    }

    return true
  } finally {
    await session.close()
  }
}

// Crear relación bidireccional
const crearAmistadMutua = async (email1, email2) => {
  const session = driver.session()
  const tx = session.beginTransaction()

  try {
    // Crear relación en ambas direcciones
    await tx.run(
      `MATCH (u1:Usuario {email: $email1})
       MATCH (u2:Usuario {email: $email2}) 
       CREATE (u1)-[r1:AMIGO_DE {desde: $desde}]->(u2)
       CREATE (u2)-[r2:AMIGO_DE {desde: $desde}]->(u1)`,
      { email1, email2, desde: new Date().toISOString() }
    )

    await tx.commit()
    return true
  } catch (error) {
    await tx.rollback()
    console.error('Error al crear amistad mutua:', error)
    throw error
  } finally {
    await session.close()
  }
}
```

### Consultar Relaciones

```js
// Buscar amigos de un usuario
const buscarAmigos = async email => {
  const session = driver.session()

  try {
    const result = await session.run(
      `MATCH (u:Usuario {email: $email})-[:AMIGO_DE]->(amigo:Usuario)
       RETURN amigo`,
      { email }
    )

    return result.records.map(record => record.get('amigo').properties)
  } finally {
    await session.close()
  }
}

// Verificar si existe una relación
const sonAmigos = async (email1, email2) => {
  const session = driver.session()

  try {
    const result = await session.run(
      `MATCH (u1:Usuario {email: $email1})
       MATCH (u2:Usuario {email: $email2})
       RETURN EXISTS((u1)-[:AMIGO_DE]->(u2)) as sonAmigos`,
      { email1, email2 }
    )

    return result.records[0].get('sonAmigos')
  } finally {
    await session.close()
  }
}
```

### Actualizar Relaciones

```js
// Actualizar propiedades de una relación
const actualizarRelacionAmistad = async (email1, email2, propiedades) => {
  const session = driver.session()

  try {
    // Construir setencias SET dinámicamente
    const setStatements = Object.entries(propiedades)
      .map(([key, _]) => `r.${key} = $${key}`)
      .join(', ')

    if (!setStatements) {
      throw new Error('No se proporcionaron propiedades para actualizar')
    }

    const result = await session.run(
      `MATCH (u1:Usuario {email: $email1})-[r:AMIGO_DE]->(u2:Usuario {email: $email2})
       SET ${setStatements}
       RETURN r`,
      { email1, email2, ...propiedades }
    )

    return result.records.length > 0
  } finally {
    await session.close()
  }
}
```

### Eliminar Relaciones

```js
// Eliminar relación entre dos nodos
const eliminarAmistad = async (email1, email2) => {
  const session = driver.session()

  try {
    const result = await session.run(
      `MATCH (u1:Usuario {email: $email1})-[r:AMIGO_DE]->(u2:Usuario {email: $email2})
       DELETE r
       RETURN count(r) as deletedCount`,
      { email1, email2 }
    )

    return result.records[0].get('deletedCount').toNumber() > 0
  } finally {
    await session.close()
  }
}

// Eliminar todas las amistades de un usuario
const eliminarTodasLasAmistades = async email => {
  const session = driver.session()

  try {
    const result = await session.run(
      `MATCH (u:Usuario {email: $email})-[r:AMIGO_DE]-()
       DELETE r
       RETURN count(r) as deletedCount`,
      { email }
    )

    return result.records[0].get('deletedCount').toNumber()
  } finally {
    await session.close()
  }
}
```

## 📊 Consultas Avanzadas

### Recorrido de Grafos

```js
// Encontrar amigos de amigos (distancia 2)
const amigosDeAmigos = async email => {
  const session = driver.session()

  try {
    const result = await session.run(
      `MATCH (u:Usuario {email: $email})-[:AMIGO_DE]->(amigo)-[:AMIGO_DE]->(amigoDeAmigo)
       WHERE amigoDeAmigo <> u // Excluir al usuario original
       RETURN DISTINCT amigoDeAmigo as recomendacion, 
              count(amigo) as conexionesComunes
       ORDER BY conexionesComunes DESC`,
      { email }
    )

    return result.records.map(record => ({
      usuario: record.get('recomendacion').properties,
      conexionesComunes: record.get('conexionesComunes').toNumber()
    }))
  } finally {
    await session.close()
  }
}

// Encontrar el camino más corto entre dos usuarios
const caminoMasCorto = async (email1, email2) => {
  const session = driver.session()

  try {
    const result = await session.run(
      `MATCH path = shortestPath((u1:Usuario {email: $email1})-[:AMIGO_DE*]-(u2:Usuario {email: $email2}))
       RETURN [node IN nodes(path) | node.nombre] AS nombres,
              length(path) AS distancia`,
      { email1, email2 }
    )

    if (result.records.length === 0) {
      return { encontrado: false }
    }

    return {
      encontrado: true,
      camino: result.records[0].get('nombres'),
      distancia: result.records[0].get('distancia').toNumber()
    }
  } finally {
    await session.close()
  }
}
```

### Algoritmos de Grafos

```js
// Nota: Requiere las extensiones GDS (Graph Data Science) instaladas en Neo4j

// Análisis de centralidad (importancia de nodos)
const analizarCentralidadUsuarios = async () => {
  const session = driver.session()

  try {
    // Crear un grafo en memoria
    await session.run(`
      CALL gds.graph.project(
        'grafoUsuarios',
        'Usuario',
        'AMIGO_DE'
      )
    `)

    // Calcular PageRank
    const result = await session.run(`
      CALL gds.pageRank.stream('grafoUsuarios')
      YIELD nodeId, score
      MATCH (u:Usuario) WHERE id(u) = nodeId
      RETURN u.nombre AS nombre, u.email AS email, score AS importancia
      ORDER BY importancia DESC
      LIMIT 10
    `)

    // Limpiar el grafo en memoria
    await session.run(`CALL gds.graph.drop('grafoUsuarios')`)

    return result.records.map(record => ({
      nombre: record.get('nombre'),
      email: record.get('email'),
      importancia: record.get('importancia')
    }))
  } finally {
    await session.close()
  }
}

// Detectar comunidades de usuarios
const detectarComunidades = async () => {
  const session = driver.session()

  try {
    // Crear grafo en memoria
    await session.run(`
      CALL gds.graph.project(
        'grafoUsuarios',
        'Usuario',
        'AMIGO_DE'
      )
    `)

    // Detectar comunidades con Louvain
    const result = await session.run(`
      CALL gds.louvain.stream('grafoUsuarios')
      YIELD nodeId, communityId
      MATCH (u:Usuario) WHERE id(u) = nodeId
      RETURN communityId, collect(u.nombre) AS miembros, count(*) AS tamaño
      ORDER BY tamaño DESC
    `)

    // Limpiar grafo
    await session.run(`CALL gds.graph.drop('grafoUsuarios')`)

    return result.records.map(record => ({
      comunidadId: record.get('communityId').toNumber(),
      miembros: record.get('miembros'),
      tamaño: record.get('tamaño').toNumber()
    }))
  } finally {
    await session.close()
  }
}
```

## 🛠 Patrones Avanzados

### Patrón Repositorio

```js
// Implementación de un repositorio para Usuario
class UsuarioRepository {
  constructor(driver) {
    this.driver = driver
  }

  async crear(usuario) {
    const session = this.driver.session()
    try {
      const result = await session.run(
        `CREATE (u:Usuario {
          id: $id,
          nombre: $nombre,
          email: $email,
          edad: $edad,
          fechaRegistro: $fechaRegistro
        }) RETURN u`,
        {
          id: usuario.id || crypto.randomUUID(),
          nombre: usuario.nombre,
          email: usuario.email,
          edad: usuario.edad,
          fechaRegistro: new Date().toISOString()
        }
      )

      return result.records[0].get('u').properties
    } finally {
      await session.close()
    }
  }

  async buscarPorEmail(email) {
    const session = this.driver.session()
    try {
      const result = await session.run('MATCH (u:Usuario {email: $email}) RETURN u', { email })

      if (result.records.length === 0) {
        return null
      }

      return result.records[0].get('u').properties
    } finally {
      await session.close()
    }
  }

  async actualizar(email, actualizaciones) {
    // Implementación de actualización...
  }

  async eliminar(email) {
    // Implementación de eliminación...
  }

  async crearAmistad(email1, email2) {
    // Implementación para crear relación...
  }
}

// Uso del repositorio
const usuarioRepo = new UsuarioRepository(driver)
await usuarioRepo.crear({
  nombre: 'Juan Pérez',
  email: 'juan@example.com',
  edad: 30
})
```

## 🔄 Cierre de Recursos

```js
// Cierre ordenado para finalizar la aplicación
const cerrarDriver = async () => {
  try {
    await driver.close()
    console.log('Conexión con Neo4j cerrada correctamente')
  } catch (error) {
    console.error('Error al cerrar la conexión:', error)
  }
}

// Para aplicaciones con manejo de señales
process.on('SIGTERM', async () => {
  console.log('Señal de terminación recibida, cerrando conexiones...')
  await cerrarDriver()
  process.exit(0)
})
```

## 📈 Monitoreo y Optimización

```js
// Configurar driver con métricas y logging
const driverConMonitoreo = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'password'),
  {
    logging: {
      level: 'info',
      logger: (level, message) => {
        console.log(`[Neo4j ${level}] ${message}`)
      }
    }
  }
)

// Monitorear estado de la conexión
const verificarEstado = async () => {
  try {
    await driver.verifyConnectivity()
    console.log('Conexión a Neo4j verificada y funcionando correctamente')
    return true
  } catch (error) {
    console.error('Error de conectividad con Neo4j:', error)
    return false
  }
}
```

---

Este documento es parte de la guía de estudio de bases de datos NoSQL, centrado en el uso del driver de Neo4j para Node.js como Object Graph Mapper (OGM).
