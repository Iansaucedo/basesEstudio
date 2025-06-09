
# 📘 NoSQL Aggregation Cheat Sheet (MongoDB & Neo4j)

This README provides a quick-reference guide comparing **SQL**, **MongoDB Aggregation Framework**, and **Neo4j Cypher** operators with examples.

---

## 📦 MongoDB Aggregation Operators – SQL Equivalents

| SQL Equivalent     | MongoDB Operator          | Description                                         | MongoDB Example |
|--------------------|---------------------------|-----------------------------------------------------|-----------------|
| `SELECT`           | `$project`                | Select specific fields                              | `db.users.aggregate([{ $project: { name: 1, age: 1, _id: 0 } }])` |
| `WHERE`            | `$match`                  | Filter documents based on a condition               | `db.users.aggregate([{ $match: { age: { $gt: 18 } } }])` |
| `GROUP BY`         | `$group`                  | Group documents and aggregate data                  | `db.users.aggregate([{ $group: { _id: "$dept", total: { $sum: 1 } } }])` |
| `ORDER BY`         | `$sort`                   | Sort documents                                      | `db.users.aggregate([{ $sort: { age: -1 } }])` |
| `LIMIT`            | `$limit`                  | Limit number of results                             | `db.users.aggregate([{ $limit: 10 }])` |
| `OFFSET` / `SKIP`  | `$skip`                   | Skip a number of documents                          | `db.users.aggregate([{ $skip: 5 }])` |
| `HAVING`           | `$match` (after `$group`) | Filter after grouping                               | `db.users.aggregate([{ $group: { _id: "$dept", total: { $sum: 1 } } }, { $match: { total: { $gt: 10 } } }])` |
| `JOIN`             | `$lookup`                 | Join another collection                             | `db.orders.aggregate([{ $lookup: { from: "users", localField: "user_id", foreignField: "id", as: "user_info" } }])` |
| `UNION`            | `$unionWith`              | Combine multiple collections                        | `db.sales.aggregate([{ $unionWith: { coll: "returns", pipeline: [] } }])` |
| `COUNT(*)`         | `$count`                  | Count documents                                     | `db.users.aggregate([{ $count: "total_users" }])` |
| `SUM()`            | `$sum`                    | Calculate sum                                       | `db.orders.aggregate([{ $group: { _id: null, total: { $sum: "$price" } } }])` |
| `AVG()`            | `$avg`                    | Calculate average                                   | `db.users.aggregate([{ $group: { _id: "$dept", avgAge: { $avg: "$age" } } }])` |
| `MIN()`            | `$min`                    | Minimum value                                       | `db.users.aggregate([{ $group: { _id: "$dept", minAge: { $min: "$age" } } }])` |
| `MAX()`            | `$max`                    | Maximum value                                       | `db.users.aggregate([{ $group: { _id: "$dept", maxAge: { $max: "$age" } } }])` |

---

## 🧠 Neo4j Cypher Operators – SQL Equivalents

| SQL Equivalent     | Cypher Operator           | Description                                         | Cypher Example |
|--------------------|---------------------------|-----------------------------------------------------|----------------|
| `SELECT`           | `RETURN`                  | Return specific fields                              | `MATCH (p:Person) RETURN p.name, p.age` |
| `WHERE`            | `WHERE`                   | Filter nodes/relationships                          | `MATCH (p:Person) WHERE p.age > 30 RETURN p` |
| `GROUP BY`         | `WITH ... RETURN`         | Group and aggregate                                 | `MATCH (p:Person) WITH p.city AS city, count(*) AS total RETURN city, total` |
| `ORDER BY`         | `ORDER BY`                | Sort results                                        | `MATCH (p:Person) RETURN p.name ORDER BY p.age DESC` |
| `LIMIT`            | `LIMIT`                   | Limit number of results                             | `MATCH (p:Person) RETURN p.name LIMIT 5` |
| `OFFSET` / `SKIP`  | `SKIP`                    | Skip a number of results                            | `MATCH (p:Person) RETURN p.name SKIP 5` |
| `HAVING`           | `WITH ... WHERE`          | Filter after aggregation                            | `MATCH (p:Person) WITH p.city AS city, count(*) AS c WHERE c > 10 RETURN city, c` |
| `JOIN`             | Pattern Matching          | Traverse relationships                              | `MATCH (a:Author)-[:WROTE]->(b:Book) RETURN a.name, b.title` |
| `UNION`            | `UNION`                   | Combine results from multiple queries               | `MATCH (s:Student)-[:IN]->(:Department {name: 'Math'}) RETURN s.name UNION MATCH (s:Student)-[:IN]->(:Department {name: 'Physics'}) RETURN s.name` |
| `COUNT(*)`         | `count(*)`                | Count nodes or patterns                             | `MATCH (p:Person) RETURN count(p)` |
| `SUM()`            | `sum()`                   | Sum values                                          | `MATCH (p:Person) RETURN sum(p.age)` |
| `AVG()`            | `avg()`                   | Average value                                       | `MATCH (p:Person) RETURN avg(p.age)` |
| `MIN()`            | `min()`                   | Minimum value                                       | `MATCH (p:Person) RETURN min(p.age)` |
| `MAX()`            | `max()`                   | Maximum value                                       | `MATCH (p:Person) RETURN max(p.age)` |

---


