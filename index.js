const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());



// DB_USER=VegetablesPlanet
// DB_PASS=mJnZRjGeebGXU63n



// Get JWT Token

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({message: 'UnAuthorized Aceess'})
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err){
            return res.status(403).send({message: 'Forbidden Access'})
        }
        // console.log('decoded', decoded);
        req.decoded = decoded;
    })
    // console.log('Inside VerifyJWT',authHeader);
    next();
}


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wmrfn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async() => {
    try{
        await client.connect();
        const vegetablesCollection = client.db("VegetablesPlanet").collection("Vegetables");

        // Auth
        app.post('/login', async(req,res) => {   
            const user= req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'});
            res.send(accessToken);

        })

        // Get Inventories
        app.get('/inventories', async(req, res) => {
            const query = {};
            const cursor = vegetablesCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
            
        });

        // Get MyItems
        app.get('/myInventories', verifyToken, async(req, res) => {
            const decodedEmail = req.decoded.email;
            const email = req.query.email;
            if(email === decodedEmail){
            const query = {email: email};
            const cursor = vegetablesCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
            }
        });

        // get Specific Inventory
        app.get('/inventory/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const inventory = await vegetablesCollection.findOne(query);
            res.send(inventory);
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
            const sold = req.body.newSold;
            const query = {_id: ObjectId(id)};
            const options = {upsert:true};
            const updatedDoc = {
                $set : {quantity, sold}
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