const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.port || 5000;

// middleware
app.use(express.json());
app.use(cors());



// DB_USER=VegetablesPlanet
// DB_PASS=mJnZRjGeebGXU63n


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wmrfn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async() => {
    try{
        await client.connect();
        const vegetablesCollection = client.db("VegetablesPlanet").collection("Vegetables");

        // Auth
        app.post('/login', async(req,res) => {   
            const user= req.body;
            const accessToken = jwy.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'});
            res.send(accessToken);

        })

        // Get Inventories
        app.get('/inventories', async(req, res) => {
            const query = {};
            const cursor = vegetablesCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        // get Specific Inventory
        app.get('/inventory/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const inventory = await vegetablesCollection.findOne(query);
            res.send(inventory);
        })

        // get delivery
        app.get('/inventory/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};

        })

        // add/create inventory
        app.post('/inventory', async(req, res) => {
            const newInventory = req.body;
            const result = await vegetablesCollection.insertOne(newInventory);
            res.send(result);

        })

        // Update Inventory
        app.put('/inventory/:id', async(req, res) => {
            const id = req.params.id;
            const updatedInventory = req.body;
            const query = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc = {
                $set : updatedInventory
            };
            const result = await vegetablesCollection.updateOne(query, updatedDoc, options);
            res.send(result);
        })

        // update quantity
        app.put('/updatequantity/:id', async(req, res) => {

            const id = req.params.id;
            const quantity = req.body.newQuantity;
            console.log(quantity);
            const query = {_id: ObjectId(id)};
            const options = {upsert:true};
            const updatedDoc = {
                $set : {quantity}
            };
            const result = await vegetablesCollection.updateOne(query, updatedDoc, options);
            res.send(result);
        })

        // delete inventory
        app.delete('/inventory/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await vegetablesCollection.deleteOne(query);
            res.send(result);
        })
        

    }finally{

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Running Vegetables Planet Server")
})


app.listen(port, () => {
    console.log('Listening to Port', port);
})