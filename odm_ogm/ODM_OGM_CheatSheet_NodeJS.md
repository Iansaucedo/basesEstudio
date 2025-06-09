
# 🧠 ODM & OGM Cheat Sheet for Node.js (Mongoose & Neo4j Driver)

This cheat sheet includes quick commands, real-world examples, and practice exercises to master ODM with **Mongoose** and OGM with **Neo4j Driver**.

---

## 📦 Section 1: Mongoose (ODM for MongoDB)

### 🔧 Setup

```bash
npm install mongoose
```

### 🔗 Connect to MongoDB

```js
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mydb');
```

### 📄 Define Schema and Model

```js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  age: Number
});

const User = mongoose.model('User', userSchema);
```

### 🧪 CRUD Operations

```js
// Create
await User.create({ name: "Ana", email: "ana@mail.com", age: 25 });

// Read
const user = await User.findOne({ email: "ana@mail.com" });

// Update
await User.updateOne({ email: "ana@mail.com" }, { $set: { age: 26 } });

// Delete
await User.deleteOne({ email: "ana@mail.com" });
```

### 🔁 Relations and Population

```js
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const Post = mongoose.model('Post', postSchema);

// Create with reference
const post = await Post.create({ title: "ODM Tips", content: "Use schemas!", author: user._id });

// Populate
const posts = await Post.find().populate('author');
```

---

## 🧠 Section 2: Neo4j Driver (OGM for Neo4j)

### 🔧 Setup

```bash
npm install neo4j-driver
```

### 🔗 Connect to Neo4j

```js
const neo4j = require('neo4j-driver');
const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'password'));
const session = driver.session();
```

### 🧪 CRUD Operations (Cypher)

```js
// Create
await session.run(
  'CREATE (u:User {name: $name, age: $age}) RETURN u',
  { name: "Ana", age: 25 }
);

// Read
await session.run(
  'MATCH (u:User {name: $name}) RETURN u',
  { name: "Ana" }
);

// Update
await session.run(
  'MATCH (u:User {name: $name}) SET u.age = $age RETURN u',
  { name: "Ana", age: 26 }
);

// Delete
await session.run(
  'MATCH (u:User {name: $name}) DETACH DELETE u',
  { name: "Ana" }
);
```

### 🔗 Create Relationship

```js
await session.run(
  `
  MATCH (u:User {name: $name})
  CREATE (p:Post {title: $title})
  CREATE (u)-[:WROTE]->(p)
  `,
  { name: "Ana", title: "OGM Best Practices" }
);
```

---

## 🎯 Practice Exercises

### ✅ Mongoose (ODM)
1. Define a `Book` schema with fields `title`, `pages`, and `author` (ref to User).
2. Create a book for Ana and populate it.
3. Update the book's page count.
4. Delete all books with less than 10 pages.

### ✅ Neo4j (OGM)
1. Create a `Post` node with `title` and `tags`.
2. Link a `User` to that post with `[:WROTE]`.
3. Update the post's title using Cypher parameters.
4. Delete the post and the relationship.

---

## 📚 Resources

- [Mongoose Docs](https://mongoosejs.com/docs/)
- [Neo4j JavaScript Driver Docs](https://neo4j.com/docs/javascript-manual/)

