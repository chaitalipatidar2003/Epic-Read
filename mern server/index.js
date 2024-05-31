const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

dotenv.config();

const app = express();



const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB configuration
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const uri = `mongodb+srv://${username}:${password}@cluster0.gbmeo9v.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Create a collection of documents
    const bookCollections = client.db("BookInventory").collection("books");

    // Insert a book to database: POST method
    app.post("/upload-book", async (req, res) => {
      const data = req.body;
      const result = await bookCollections.insertOne(data);
      res.send(result);
    });

    // Get all books
    app.get("/all-books", async (req, res) => {
      let query = {};
      if (req.query?.category) {
        query = { category: req.query.category };
      }
      const result = await bookCollections.find(query).toArray();
      res.send(result);
    });

    // Get a single book data
    app.get("/book/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Received request for book ID:", id);
      const filter = { _id: new ObjectId(id) };
      const result = await bookCollections.findOne(filter);
      console.log("Sending book data:", result);
      res.send(result);
    });

    // Update book data
    app.patch("/book/:id", async (req, res) => {
      const id = req.params.id;
      const updateBookData = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          ...updateBookData
        },
      };

      const result = await bookCollections.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    // Delete a book
    app.delete("/book/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await bookCollections.deleteOne(filter);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensure that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

// Serve static files from the React app

const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, '/mern-client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(_dirname, 'mern-client', 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
