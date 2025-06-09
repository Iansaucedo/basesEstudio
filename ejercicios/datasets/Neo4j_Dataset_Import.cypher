// Neo4j Red Social Dataset para importar
// Copiar y ejecutar este script en la consola de Neo4j Browser

// Limpiar base de datos (¡cuidado! esto elimina todos los datos)
MATCH (n) DETACH DELETE n;

// Crear restricciones e índices
CREATE CONSTRAINT person_email IF NOT EXISTS
FOR (p:Person) REQUIRE p.email IS UNIQUE;

CREATE CONSTRAINT group_name IF NOT EXISTS
FOR (g:Group) REQUIRE g.name IS UNIQUE;

CREATE INDEX topic_name IF NOT EXISTS
FOR (t:Topic) ON (t.name);

// Crear personas
CREATE (ana:Person {
  name: "Ana Rodríguez",
  email: "ana@example.com",
  age: 28,
  location: "Madrid",
  joinDate: datetime("2023-01-10")
});

CREATE (carlos:Person {
  name: "Carlos Gómez",
  email: "carlos@example.com",
  age: 35,
  location: "Barcelona",
  joinDate: datetime("2023-01-15")
});

CREATE (elena:Person {
  name: "Elena Martínez",
  email: "elena@example.com",
  age: 42,
  location: "Valencia",
  joinDate: datetime("2023-02-01")
});

CREATE (luis:Person {
  name: "Luis Fernández",
  email: "luis@example.com",
  age: 23,
  location: "Sevilla",
  joinDate: datetime("2023-02-10")
});

CREATE (maria:Person {
  name: "María López",
  email: "maria@example.com",
  age: 31,
  location: "Madrid",
  joinDate: datetime("2023-01-20")
});

CREATE (pedro:Person {
  name: "Pedro Sánchez",
  email: "pedro@example.com",
  age: 27,
  location: "Barcelona",
  joinDate: datetime("2023-03-05")
});

// Crear grupos
CREATE (tech:Group {
  name: "Tecnología Avanzada",
  description: "Grupo de discusión sobre avances tecnológicos",
  creationDate: datetime("2023-01-05")
});

CREATE (photo:Group {
  name: "Fotógrafos Urbanos",
  description: "Compartimos fotografías urbanas y técnicas",
  creationDate: datetime("2023-01-15")
});

CREATE (book:Group {
  name: "Club de Lectura",
  description: "Compartimos reseñas y recomendaciones de libros",
  creationDate: datetime("2023-02-10")
});

// Crear temas
CREATE (ai:Topic {name: "Inteligencia Artificial"});
CREATE (ml:Topic {name: "Machine Learning"});
CREATE (photo_t:Topic {name: "Fotografía"});
CREATE (travel:Topic {name: "Viajes"});
CREATE (fiction:Topic {name: "Ficción"});
CREATE (science:Topic {name: "Ciencia"});

// Crear Posts
CREATE (post1:Post {
  id: "post-001",
  content: "Acabo de terminar de leer un libro increíble sobre IA. ¡Muy recomendado!",
  createdAt: datetime("2023-02-15"),
  likes: 15
});

CREATE (post2:Post {
  id: "post-002",
  content: "Aquí les comparto mi última fotografía del centro de Madrid al atardecer",
  createdAt: datetime("2023-02-20"),
  likes: 23
});

CREATE (post3:Post {
  id: "post-003",
  content: "¿Alguien conoce buenos recursos para aprender sobre redes neuronales?",
  createdAt: datetime("2023-03-01"),
  likes: 7
});

CREATE (post4:Post {
  id: "post-004",
  content: "Acabo de volver de un viaje increíble a Japón. ¡Tantas fotos que compartir!",
  createdAt: datetime("2023-03-10"),
  likes: 32
});

// Crear eventos
CREATE (event1:Event {
  id: "event-001",
  title: "Workshop de Machine Learning",
  description: "Taller práctico de ML con Python",
  date: datetime("2023-04-15"),
  location: "Online"
});

CREATE (event2:Event {
  id: "event-002",
  title: "Exposición de Fotografía Urbana",
  description: "Exhibición de los mejores trabajos de nuestros miembros",
  date: datetime("2023-05-10"),
  location: "Galería Central, Madrid"
});

CREATE (event3:Event {
  id: "event-003",
  title: "Club de Lectura: Encuentro mensual",
  description: "Discusión sobre el libro del mes",
  date: datetime("2023-04-05"),
  location: "Biblioteca Municipal, Barcelona"
});

// Crear relaciones: FOLLOWS (Usuario sigue a Usuario)
CREATE (ana)-[:FOLLOWS {since: datetime("2023-01-15")}]->(maria)
CREATE (ana)-[:FOLLOWS {since: datetime("2023-02-01")}]->(carlos)
CREATE (luis)-[:FOLLOWS {since: datetime("2023-02-15")}]->(ana)
CREATE (maria)-[:FOLLOWS {since: datetime("2023-01-25")}]->(carlos)
CREATE (carlos)-[:FOLLOWS {since: datetime("2023-02-05")}]->(elena)
CREATE (elena)-[:FOLLOWS {since: datetime("2023-02-20")}]->(ana)
CREATE (pedro)-[:FOLLOWS {since: datetime("2023-03-10")}]->(luis)
CREATE (pedro)-[:FOLLOWS {since: datetime("2023-03-10")}]->(maria);

// Crear relaciones: FRIENDS_WITH (Amistad mutua)
CREATE (ana)-[:FRIENDS_WITH {since: datetime("2023-01-20")}]->(carlos)
CREATE (carlos)-[:FRIENDS_WITH {since: datetime("2023-01-20")}]->(ana)
CREATE (elena)-[:FRIENDS_WITH {since: datetime("2023-02-15")}]->(maria)
CREATE (maria)-[:FRIENDS_WITH {since: datetime("2023-02-15")}]->(elena);

// Crear relaciones: MEMBER_OF (Usuario miembro de Grupo)
CREATE (ana)-[:MEMBER_OF {joinedAt: datetime("2023-01-08"), isAdmin: true}]->(tech)
CREATE (carlos)-[:MEMBER_OF {joinedAt: datetime("2023-01-10")}]->(tech)
CREATE (elena)-[:MEMBER_OF {joinedAt: datetime("2023-01-25")}]->(tech)
CREATE (maria)-[:MEMBER_OF {joinedAt: datetime("2023-01-18"), isAdmin: true}]->(photo)
CREATE (luis)-[:MEMBER_OF {joinedAt: datetime("2023-02-12")}]->(photo)
CREATE (pedro)-[:MEMBER_OF {joinedAt: datetime("2023-03-08")}]->(photo)
CREATE (elena)-[:MEMBER_OF {joinedAt: datetime("2023-02-15"), isAdmin: true}]->(book)
CREATE (ana)-[:MEMBER_OF {joinedAt: datetime("2023-02-18")}]->(book)
CREATE (carlos)-[:MEMBER_OF {joinedAt: datetime("2023-02-25")}]->(book);

// Crear relaciones: CREATED (Usuario crea Post)
CREATE (ana)-[:CREATED]->(post1)
CREATE (maria)-[:CREATED]->(post2)
CREATE (carlos)-[:CREATED]->(post3)
CREATE (luis)-[:CREATED]->(post4);

// Crear relaciones: LIKES (Usuario le gusta un Post)
CREATE (carlos)-[:LIKES {at: datetime("2023-02-16")}]->(post1)
CREATE (elena)-[:LIKES {at: datetime("2023-02-17")}]->(post1)
CREATE (ana)-[:LIKES {at: datetime("2023-02-21")}]->(post2)
CREATE (pedro)-[:LIKES {at: datetime("2023-02-22")}]->(post2)
CREATE (luis)-[:LIKES {at: datetime("2023-02-22")}]->(post2)
CREATE (ana)-[:LIKES {at: datetime("2023-03-02")}]->(post3)
CREATE (maria)-[:LIKES {at: datetime("2023-03-11")}]->(post4)
CREATE (carlos)-[:LIKES {at: datetime("2023-03-12")}]->(post4);

// Crear relaciones: COMMENTED_ON (Usuario comenta en Post)
CREATE (elena)-[:COMMENTED_ON {at: datetime("2023-02-16"), content: "¡Comparte el título del libro por favor!"}]->(post1)
CREATE (carlos)-[:COMMENTED_ON {at: datetime("2023-02-21"), content: "¡Increíble foto! ¿Qué cámara usaste?"}]->(post2)
CREATE (ana)-[:COMMENTED_ON {at: datetime("2023-03-02"), content: "Te recomiendo el curso de Andrew Ng en Coursera"}]->(post3)
CREATE (elena)-[:COMMENTED_ON {at: datetime("2023-03-12"), content: "¡Qué envidia! Japón está en mi lista de pendientes"}]->(post4);

// Crear relaciones: INTERESTED_IN (Usuario interesado en Tema)
CREATE (ana)-[:INTERESTED_IN]->(ai)
CREATE (ana)-[:INTERESTED_IN]->(science)
CREATE (carlos)-[:INTERESTED_IN]->(ml)
CREATE (carlos)-[:INTERESTED_IN]->(ai)
CREATE (elena)-[:INTERESTED_IN]->(fiction)
CREATE (elena)-[:INTERESTED_IN]->(science)
CREATE (maria)-[:INTERESTED_IN]->(photo_t)
CREATE (maria)-[:INTERESTED_IN]->(travel)
CREATE (luis)-[:INTERESTED_IN]->(photo_t)
CREATE (luis)-[:INTERESTED_IN]->(travel)
CREATE (pedro)-[:INTERESTED_IN]->(photo_t);

// Crear relaciones: ABOUT (Post relacionado con Tema)
CREATE (post1)-[:ABOUT]->(ai)
CREATE (post1)-[:ABOUT]->(science)
CREATE (post2)-[:ABOUT]->(photo_t)
CREATE (post3)-[:ABOUT]->(ml)
CREATE (post3)-[:ABOUT]->(ai)
CREATE (post4)-[:ABOUT]->(travel)
CREATE (post4)-[:ABOUT]->(photo_t);

// Crear relaciones: ATTENDING (Usuario asistirá a Evento)
CREATE (ana)-[:ATTENDING]->(event1)
CREATE (carlos)-[:ATTENDING]->(event1)
CREATE (elena)-[:ATTENDING]->(event1)
CREATE (maria)-[:ATTENDING]->(event2)
CREATE (luis)-[:ATTENDING]->(event2)
CREATE (pedro)-[:ATTENDING]->(event2)
CREATE (ana)-[:ATTENDING]->(event2)
CREATE (elena)-[:ATTENDING]->(event3)
CREATE (ana)-[:ATTENDING]->(event3);

// Crear relaciones: HOSTED_BY (Evento organizado por Grupo)
CREATE (event1)-[:HOSTED_BY]->(tech)
CREATE (event2)-[:HOSTED_BY]->(photo)
CREATE (event3)-[:HOSTED_BY]->(book);
