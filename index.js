require("dotenv").config()
const express = require("express")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000
const cors = require("cors")

app.use(cors())
app.use(express.json())


app.get("/", (req, res) => {
    res.send("QuickMart Database is running")
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@inventorycluster.dks3jbe.mongodb.net/?retryWrites=true&w=majority&appName=inventoryCluster`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

async function run() {
    try {

        const productsCollection = client.db("quick_mart").collection("products")

        app.post("/products", async (req, res) => {
            const data = req.body
            const result = await productsCollection.insertOne(data)
            res.send(result)
        })
        app.get("/products", async (req, res) => {
            const result = await productsCollection.find().toArray()
            res.send(result)
        })
        app.get("/products/newest", async (req, res) => {
            const result = await productsCollection.find({})
                .sort({ _id: -1 })
                .limit(6).toArray()
            res.send(result)
        })
        app.get("/products/:id", async (req, res) => {
            const id = req.params.id
            const find = { _id: new ObjectId(id) }
            const result = await productsCollection.findOne(find)
            res.send(result)
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {


    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`QuickMart Database is Running on ${port}`);
})