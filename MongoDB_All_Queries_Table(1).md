
# 📘 MongoDB Comprehensive Query Table

This table summarizes all key MongoDB operations: CRUD, Aggregations, Joins, Indexing, and Upserts.

| Category        | Operation         | Purpose / Description                               | Example |
|----------------|-------------------|------------------------------------------------------|---------|
| 📝 Create       | `insertOne()`      | Insert a single document                            | `db.users.insertOne({ name: "Ana", age: 28 })` |
|                | `insertMany()`     | Insert multiple documents                           | `db.users.insertMany([{ name: "Ana" }, { name: "Luis" }])` |
| 📤 Read         | `find()`           | Find documents with conditions                      | `db.users.find({ age: { $gt: 25 } })` |
|                | `findOne()`        | Find a single document                              | `db.users.findOne({ email: "ana@example.com" })` |
| 🔧 Update       | `updateOne()`      | Update the first matching document                  | `db.users.updateOne({ name: "Ana" }, { $set: { age: 30 } })` |
|                | `updateMany()`     | Update multiple documents                           | `db.users.updateMany({ age: { $lt: 18 } }, { $set: { minor: true } })` |
|                | `upsert` (with `updateOne`) | Update or insert if not found            | `db.users.updateOne({ email: "ana@example.com" }, { $set: { name: "Ana" } }, { upsert: true })` |
|                | `upsert` (with `updateMany`) | Insert one if none match                   | `db.logs.updateMany({ status: "new" }, { $set: { reviewed: false } }, { upsert: true })` |
| ❌ Delete       | `deleteOne()`      | Delete the first matching document                  | `db.users.deleteOne({ name: "Ana" })` |
|                | `deleteMany()`     | Delete all matching documents                       | `db.users.deleteMany({ active: false })` |
| 📚 Aggregation  | `$match`           | Filter documents in aggregation pipeline            | `{ $match: { age: { $gt: 25 } } }` |
|                | `$project`         | Select specific fields                              | `{ $project: { name: 1, age: 1, _id: 0 } }` |
|                | `$group`           | Group and aggregate                                 | `{ $group: { _id: "$dept", count: { $sum: 1 } } }` |
|                | `$sort`            | Sort documents                                      | `{ $sort: { age: -1 } }` |
|                | `$limit`           | Limit number of results                             | `{ $limit: 5 }` |
|                | `$skip`            | Skip a number of documents                          | `{ $skip: 5 }` |
|                | `$count`           | Count documents in pipeline                         | `{ $count: "total" }` |
|                | `$sum`             | Sum a field in a group                              | `{ $sum: "$amount" }` |
|                | `$avg`             | Calculate average                                   | `{ $avg: "$score" }` |
|                | `$min`             | Find minimum value                                  | `{ $min: "$price" }` |
|                | `$max`             | Find maximum value                                  | `{ $max: "$price" }` |
|                | `$unionWith`       | Merge pipelines from other collections              | `{ $unionWith: { coll: "returns", pipeline: [] } }` |
|                | `$out`             | Write aggregation result to a new collection        | `{ $out: "backup" }` |
| 🔗 Join         | `$lookup`          | Join with another collection                        | `{ $lookup: { from: "users", localField: "user_id", foreignField: "id", as: "user_info" } }` |
| 📈 Indexing     | `createIndex()`    | Create an index on a field                          | `db.users.createIndex({ email: 1 })` |
|                | `getIndexes()`     | List all indexes on a collection                    | `db.users.getIndexes()` |
|                | `dropIndex()`      | Drop a specific index                               | `db.users.dropIndex("email_1")` |
