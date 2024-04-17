const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(bodyParser.json());
app.use(cors());

require("dotenv").config();
console.log(process.env.DB_USER);
const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri = `mongodb+srv://:ST72A9Brh3ZPqfOs@amajohnstore.lb8x71w.mongodb.net/?retryWrites=true&w=majority&appName=amaJohnStore`;

const client = new MongoClient(uri);

async function run() {
  try {
  
    const productCollection =client.db("amaJohnStore").collection("products");
    const ordersCollection =client.db("amaJohnStore").collection("orders");
    app.post("/addProduct", async (req, res) => {
      const product = req.body;
      await productCollection.insertMany(product).then((result) => {
        console.log(result.insertedCount);
        res.send(result.insertedCount);
      });
    });
    app.get("/products", async (req, res) => {
      const data = productCollection.find({}).limit(30);
      const documents = await data.toArray();
      res.send(documents);
    });
    app.get("/product/:key", async (req, res) => {
      const data = productCollection.find({ key: req.params.key });
      const documents = await data.toArray();
      res.send(documents[0]);
    });
    app.post("/productsByKeys", async (req, res) => {
      const productKeys = req.body;
        const data =  productCollection.find({ key: { $in: productKeys } });
      const documents = await data.toArray();
      res.send(documents);
    });
    app.post("/addOrder", async (req, res) => {
      const order = req.body;
      await ordersCollection.insertOne(order)
      .then((result) => {
        res.send(result.insertedCount);
      });
    });
    console.log("db is connected");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hello ema wetson !");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
