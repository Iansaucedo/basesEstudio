# 🕸 Soluciones de Neo4j

[🏠 Volver a la Guía de Estudio](../../README_ES.md) | [📄 Ejercicios](../queries/Neo4j_Ejercicios.md) | [📑 Dataset](../datasets/Neo4j_Dataset_Import.cypher)

Este documento contiene las soluciones a los ejercicios de Neo4j.

---

## 🧪 Soluciones

### Nivel 1: Consultas Básicas

1. **Encontrar todas las personas que viven en Madrid**

   ```cypher
   MATCH (p:Person)
   WHERE p.location = 'Madrid'
   RETURN p.name, p.email, p.age
   ```

2. **Listar a todos los usuarios ordenados por edad (más joven primero)**

   ```cypher
   MATCH (p:Person)
   RETURN p.name, p.email, p.age, p.location
   ORDER BY p.age ASC
   ```

3. **Encontrar todos los posts con más de 15 likes**

   ```cypher
   MATCH (p:Post)
   WHERE p.likes > 15
   RETURN p.id, p.content, p.likes, p.createdAt
   ORDER BY p.likes DESC
   ```

4. **Buscar todas las personas interesadas en Fotografía**

   ```cypher
   MATCH (p:Person)-[:INTERESTED_IN]->(t:Topic {name: 'Fotografía'})
   RETURN p.name, p.email, p.location
   ```

5. **Listar todos los grupos y el número de miembros que tienen**
   ```cypher
   MATCH (g:Group)<-[:MEMBER_OF]-(p:Person)
   WITH g, COUNT(p) as miembros
   RETURN g.name as grupo, g.description as descripcion, miembros
   ORDER BY miembros DESC
   ```

### Nivel 2: Consultas de Relaciones

6. **Encontrar todos los amigos de Ana Rodríguez**

   ```cypher
   MATCH (ana:Person {name: 'Ana Rodríguez'})-[:FRIENDS_WITH]->(amigo:Person)
   RETURN ana.name as usuario, amigo.name as amigo, amigo.email, amigo.location
   ```

7. **Listar todas las personas que siguen a María López pero que María no sigue de vuelta**

   ```cypher
   MATCH (p:Person)-[:FOLLOWS]->(maria:Person {name: 'María López'})
   WHERE NOT EXISTS((maria)-[:FOLLOWS]->(p))
   RETURN p.name as seguidor, p.email, p.location
   ```

8. **Encontrar publicaciones creadas por personas que Carlos Gómez sigue**

   ```cypher
   MATCH (carlos:Person {name: 'Carlos Gómez'})-[:FOLLOWS]->(p:Person)-[:CREATED]->(post:Post)
   RETURN p.name as autor, post.content as publicacion, post.likes
   ORDER BY post.likes DESC
   ```

9. **Buscar todas las personas que asistirán al evento "Workshop de Machine Learning"**

   ```cypher
   MATCH (p:Person)-[:ATTENDING]->(e:Event {title: 'Workshop de Machine Learning'})
   RETURN p.name, p.email, p.location
   ```

10. **Listar todos los comentarios hechos en las publicaciones de Luis Fernández**
    ```cypher
    MATCH (luis:Person {name: 'Luis Fernández'})-[:CREATED]->(post:Post)<-[:COMMENTED_ON]-(p:Person)
    RETURN post.content as publicacion, p.name as autor_comentario,
           p.email as email_autor, post.createdAt as fecha_publicacion
    ```

### Nivel 3: Análisis de Grafos

11. **Encontrar el camino más corto de amistad entre Pedro Sánchez y Elena Martínez**

    ```cypher
    MATCH path = shortestPath(
      (pedro:Person {name: 'Pedro Sánchez'})-[:FRIENDS_WITH*]-(elena:Person {name: 'Elena Martínez'})
    )
    RETURN [node in nodes(path) | node.name] as camino,
           length(path) as longitud_camino
    ```

12. **Calcular el PageRank de los usuarios para identificar a los más influyentes**

    ```cypher
    CALL gds.graph.project(
      'social_network',
      'Person',
      {
        FOLLOWS: {
          orientation: 'NATURAL'
        }
      }
    )
    YIELD graphName

    CALL gds.pageRank.stream('social_network')
    YIELD nodeId, score
    MATCH (p:Person) WHERE id(p) = nodeId
    RETURN p.name as persona, score as influencia
    ORDER BY influencia DESC
    LIMIT 10
    ```

13. **Identificar comunidades en la red usando algoritmos de detección de comunidades**

    ```cypher
    CALL gds.graph.project(
      'social_network_community',
      'Person',
      {
        FRIENDS_WITH: {
          orientation: 'UNDIRECTED'
        },
        FOLLOWS: {
          orientation: 'NATURAL'
        }
      }
    )
    YIELD graphName

    CALL gds.louvain.stream('social_network_community')
    YIELD nodeId, communityId
    MATCH (p:Person) WHERE id(p) = nodeId
    RETURN communityId as comunidad, collect(p.name) as miembros, count(*) as tamaño
    ORDER BY tamaño DESC
    ```

14. **Recomendar nuevas amistades para Ana Rodríguez basadas en amigos de amigos**

    ```cypher
    MATCH (ana:Person {name: 'Ana Rodríguez'})-[:FRIENDS_WITH*2..2]-(recomendado:Person)
    WHERE NOT (ana)-[:FRIENDS_WITH]-(recomendado)
    AND recomendado.name <> 'Ana Rodríguez'
    WITH recomendado, count(*) as conexionesComunes
    RETURN recomendado.name as persona_recomendada,
           recomendado.location as ubicacion,
           conexionesComunes as amigos_en_comun
    ORDER BY conexionesComunes DESC
    ```

15. **Identificar los temas más populares basados en las interacciones (likes y comentarios)**
    ```cypher
    MATCH (t:Topic)<-[:ABOUT]-(p:Post)<-[interaction]-(person:Person)
    WHERE type(interaction) IN ['LIKES', 'COMMENTED_ON']
    WITH t, count(interaction) as interacciones
    RETURN t.name as tema, interacciones
    ORDER BY interacciones DESC
    ```

### Nivel 4: Creaciones y Actualizaciones

16. **Añadir un nuevo usuario a la red y conectarlo con al menos dos personas existentes**

    ```cypher
    // Crear nuevo usuario
    CREATE (nuevo:Person {
      name: "Javier González",
      email: "javier@example.com",
      age: 29,
      location: "Barcelona",
      joinDate: datetime()
    })

    // Conectar con Ana
    MATCH (nuevo:Person {email: "javier@example.com"}), (ana:Person {name: "Ana Rodríguez"})
    CREATE (nuevo)-[:FOLLOWS {since: datetime()}]->(ana)
    CREATE (nuevo)-[:FRIENDS_WITH {since: datetime()}]->(ana)
    CREATE (ana)-[:FRIENDS_WITH {since: datetime()}]->(nuevo)

    // Conectar con Carlos
    MATCH (nuevo:Person {email: "javier@example.com"}), (carlos:Person {name: "Carlos Gómez"})
    CREATE (nuevo)-[:FOLLOWS {since: datetime()}]->(carlos)

    // Verificar creación
    MATCH (nuevo:Person {email: "javier@example.com"})-[r]->(p)
    RETURN nuevo.name as nuevo_usuario, type(r) as relacion, p.name as conectado_con
    ```

17. **Crear un nuevo grupo y hacer que varios usuarios se unan**

    ```cypher
    // Crear nuevo grupo
    CREATE (dev:Group {
      name: "Desarrolladores Web",
      description: "Grupo para compartir conocimientos sobre desarrollo web",
      creationDate: datetime()
    })

    // Añadir usuarios al grupo
    MATCH (g:Group {name: "Desarrolladores Web"}), (ana:Person {name: "Ana Rodríguez"})
    CREATE (ana)-[:MEMBER_OF {joinedAt: datetime(), isAdmin: true}]->(g)

    MATCH (g:Group {name: "Desarrolladores Web"}), (carlos:Person {name: "Carlos Gómez"})
    CREATE (carlos)-[:MEMBER_OF {joinedAt: datetime()}]->(g)

    MATCH (g:Group {name: "Desarrolladores Web"}), (luis:Person {name: "Luis Fernández"})
    CREATE (luis)-[:MEMBER_OF {joinedAt: datetime()}]->(g)

    // Verificar miembros
    MATCH (p:Person)-[:MEMBER_OF]->(g:Group {name: "Desarrolladores Web"})
    RETURN g.name as grupo, collect(p.name) as miembros
    ```

18. **Hacer que un usuario publique un nuevo post y que otros usuarios lo comenten y den like**

    ```cypher
    // Crear nueva publicación
    MATCH (carlos:Person {name: "Carlos Gómez"})
    CREATE (post:Post {
      id: "post-005",
      content: "Acabo de publicar mi nuevo tutorial sobre Neo4j. ¡Espero que les guste!",
      createdAt: datetime(),
      likes: 0
    })
    CREATE (carlos)-[:CREATED]->(post)
    CREATE (post)-[:ABOUT]->(:Topic {name: "Bases de Datos"})

    // Añadir likes
    MATCH (post:Post {id: "post-005"}), (ana:Person {name: "Ana Rodríguez"})
    CREATE (ana)-[:LIKES {at: datetime()}]->(post)
    SET post.likes = post.likes + 1

    MATCH (post:Post {id: "post-005"}), (luis:Person {name: "Luis Fernández"})
    CREATE (luis)-[:LIKES {at: datetime()}]->(post)
    SET post.likes = post.likes + 1

    // Añadir comentarios
    MATCH (post:Post {id: "post-005"}), (elena:Person {name: "Elena Martínez"})
    CREATE (elena)-[:COMMENTED_ON {
      at: datetime(),
      content: "¡Excelente tutorial! Me ayudó mucho a entender los conceptos."
    }]->(post)

    // Verificar interacciones
    MATCH (p:Person)-[r]->(post:Post {id: "post-005"})
    RETURN p.name as usuario, type(r) as tipo_interaccion,
           CASE WHEN type(r) = 'COMMENTED_ON' THEN r.content ELSE null END as comentario,
           post.likes as total_likes
    ```

19. **Actualizar la ubicación de un usuario y reflejar este cambio en sus relaciones**

    ```cypher
    // Actualizar ubicación
    MATCH (p:Person {name: "Luis Fernández"})
    SET p.location = "Valencia",
        p.previousLocation = p.location

    // Verificar cambio
    MATCH (p:Person {name: "Luis Fernández"})
    RETURN p.name, p.location, p.previousLocation

    // Opcional: Ajustar relaciones basadas en la ubicación
    MATCH (luis:Person {name: "Luis Fernández"}), (elena:Person {location: "Valencia"})
    WHERE NOT (luis)-[:FRIENDS_WITH]-(elena)
    CREATE (luis)-[:FRIENDS_WITH {since: datetime(), reason: "Misma ciudad"}]->(elena)
    CREATE (elena)-[:FRIENDS_WITH {since: datetime(), reason: "Misma ciudad"}]->(luis)
    ```

20. **Eliminar una relación de amistad y asegurarse de que se elimina en ambas direcciones**

    ```cypher
    // Eliminar amistad bidireccional
    MATCH (p1:Person {name: "Carlos Gómez"})-[r1:FRIENDS_WITH]-(p2:Person {name: "Ana Rodríguez"})
    DELETE r1

    // Verificar que la relación ya no existe
    MATCH (p1:Person {name: "Carlos Gómez"}), (p2:Person {name: "Ana Rodríguez"})
    RETURN exists((p1)-[:FRIENDS_WITH]-(p2)) as son_amigos
    ```

---

## 🚀 Soluciones a Retos Adicionales

### 1. Algoritmo de recomendación de contenido

```cypher
// Recomendación de contenido basada en intereses compartidos
MATCH (usuario:Person {name: 'Ana Rodríguez'})
MATCH (usuario)-[:INTERESTED_IN]->(tema:Topic)
MATCH (tema)<-[:ABOUT]-(post:Post)
MATCH (post)<-[:CREATED]-(autor:Person)
WHERE NOT post<-[:LIKES|COMMENTED_ON]-(usuario)
AND autor.name <> 'Ana Rodríguez'
WITH post, count(distinct tema) as temasComunes, autor
ORDER BY temasComunes DESC, post.createdAt DESC
RETURN post.id, post.content, autor.name as autor,
       temasComunes, post.likes as popularidad
LIMIT 5
```

### 2. Sistema de detección de influenciadores

```cypher
// Crear gráfico proyectado
CALL gds.graph.project(
  'influencers',
  'Person',
  {
    FRIENDS_WITH: {
      orientation: 'UNDIRECTED',
      properties: ['since']
    },
    FOLLOWS: {
      orientation: 'NATURAL',
      properties: ['since']
    },
    CREATED: {
      orientation: 'NATURAL'
    }
  }
)

// Calcular centralidad
CALL gds.betweenness.stream('influencers')
YIELD nodeId, score as betweenness
MATCH (p:Person) WHERE id(p) = nodeId

// Añadir PageRank
CALL gds.pageRank.stream('influencers')
YIELD nodeId, score as pageRank
WHERE id(p) = nodeId

// Añadir métricas de interacción
OPTIONAL MATCH (p)-[:CREATED]->(post:Post)
WITH p, betweenness, pageRank,
     count(post) as numPosts,
     sum(post.likes) as totalLikes

RETURN p.name as persona, p.location,
       betweenness, pageRank,
       numPosts, totalLikes,
       (5*pageRank + 3*betweenness + totalLikes/100) as influencerScore
ORDER BY influencerScore DESC
LIMIT 10
```

### 3. Análisis temporal de la evolución de la red

```cypher
// Analizar crecimiento de la red por mes
MATCH (p:Person)
WITH date(p.joinDate) as fecha, count(*) as nuevosUsuarios
ORDER BY fecha
WITH
  fecha.year as año,
  fecha.month as mes,
  nuevosUsuarios,
  sum(nuevosUsuarios) OVER (ORDER BY fecha.year, fecha.month) as usuariosAcumulados
RETURN año, mes, nuevosUsuarios, usuariosAcumulados

// Analizar evolución de conexiones
MATCH (p1:Person)-[r:FOLLOWS|FRIENDS_WITH]->(p2:Person)
WHERE r.since IS NOT NULL
WITH date(r.since) as fecha, type(r) as tipoRelacion, count(*) as nuevasRelaciones
ORDER BY fecha, tipoRelacion
RETURN fecha.year as año, fecha.month as mes,
       tipoRelacion,
       nuevasRelaciones,
       sum(nuevasRelaciones) OVER (PARTITION BY tipoRelacion ORDER BY fecha.year, fecha.month) as relacionesAcumuladas
```

### 4. Sistema de recomendación de eventos

```cypher
// Recomendar eventos para Ana Rodríguez
MATCH (usuario:Person {name: 'Ana Rodríguez'})
MATCH (usuario)-[:INTERESTED_IN]->(tema:Topic)
MATCH (evento:Event)-[:ABOUT]->(tema)
WHERE NOT (usuario)-[:ATTENDING]->(evento)
AND evento.date > datetime()

WITH evento, count(distinct tema) as temasComunes

// Añadir factor de amigos que asisten
MATCH (evento)<-[:ATTENDING]-(amigo:Person)<-[:FOLLOWS|FRIENDS_WITH]-(usuario:Person {name: 'Ana Rodríguez'})
WITH evento, temasComunes, count(distinct amigo) as amigosAsistiendo

// Calcular puntuación de relevancia
WITH evento,
     temasComunes * 10 as puntosTema,
     amigosAsistiendo * 15 as puntosAmigos,
     (temasComunes * 10 + amigosAsistiendo * 15) as puntuacionTotal

RETURN evento.title as evento,
       evento.description as descripcion,
       evento.date as fecha,
       evento.location as ubicacion,
       puntosTema,
       puntosAmigos,
       puntuacionTotal
ORDER BY puntuacionTotal DESC
```

---

Este documento forma parte de la guía de estudio de bases de datos NoSQL.
