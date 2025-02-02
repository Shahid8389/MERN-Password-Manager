const express = require("express");
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cors = require('cors')
const { MongoClient, ObjectId } = require('mongodb');

dotenv.config()

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json())
app.use(cors())

// Connection URL
const url = process.env.MONGO_URI;
const client = new MongoClient(url);

// Database Name
const dbName = 'PassManager';

client.connect();

// Get all the passwords from the database
app.get("/", async function (req, res) {
    const db = client.db(dbName);
    const collection = db.collection('passwords');

    const findResult = await collection.find({}).toArray();
    res.json(findResult)
});

// Insert the passwords into the database
app.post("/", async function (req, res) {
    const { _id, ...restOfData } = req.body

    const db = client.db(dbName);
    const collection = db.collection('passwords');

    const document = _id ? { _id: ObjectId.createFromHexString(_id), ...restOfData } : restOfData;
    const insertResult = await collection.insertOne(document);

    res.send({ success: true, result: insertResult })
});

// Delete the password from the database by id
app.delete("/", async function (req, res) {
    const { id } = req.body

    const db = client.db(dbName);
    const collection = db.collection('passwords');

    const deleteResult = await collection.deleteOne({ _id: ObjectId.createFromHexString(id) });

    res.send({ success: true, result: deleteResult })
});

// To update the documents
app.put("/", async function (req, res) {
    const { _id, ...updateData } = req.body

    const db = client.db(dbName);
    const collection = db.collection('passwords');

    const objId = ObjectId.createFromHexString(_id);
    const updateResult = await collection.updateOne(
        { _id: objId },
        {
            $set: updateData
        }
    );

    res.send({ success: true, result: updateResult })
});

app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
});