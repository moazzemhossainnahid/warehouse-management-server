const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.port || 5000;

// middleware
app.use(express.json());
app.use(cors());



// DB_USER=VegetablesPlanet
// DB_PASS=mJnZRjGeebGXU63n

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://<username>:<password>@cluster0.wmrfn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

app.get('/', (req, res) => {
    res.send("Running Vegetables Planet Server")
})


app.listen(port, () => {
    console.log('Listening to Port', port);
})