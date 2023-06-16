const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const colors = require("colors")


// middleware
app.use(cors());
app.use(express.json());


// mongoDB
const uri = process.env.URL;
// console.log(uri);
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
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");


      const usersCollections = client.db("musicyDB").collection("users");
      const classesCollections = client.db("musicyDB").collection("classes");

// addUsers from firebase
      app.post("/addUsers", async(req, res)=>{
        const data = req.body;
        console.log(data,"data");
        const getUser = await usersCollections.findOne({email: data.email})
        if(!getUser?.email){
            const result = await usersCollections.insertOne(data)
        if(result){
            res.send(result)
        }
        console.log(result,'success'); 
        }
         else{
            res.send({error: 'already added user in db'})
         }
       
      })


      app.get('/allUsers', async(req, res) =>{
        const query = {} 
        const result = await usersCollections.find(query).toArray();
        res.send(result)
      })

      


      app.put('/changeRole', async(req, res) =>{
        const {id, role: newRole} = req.body

        const filter = {_id: new ObjectId(id)}

        // const filter2={email:req.body.email}

        const updaterDoc = {
            $set: {
                role: newRole
            }
        }
        
        console.log(filter, 'data');
        const result = await usersCollections.updateOne(filter,updaterDoc);
        console.log(result);
        res.send(result)
      })

      app.get('/checkRole/:email', async(req, res) =>{
        const query = {email: req.params.email} 
        console.log(query,"query");
        if(req.params.email){
            const getUser = await usersCollections.findOne(query);
            
            res.status(200).json(getUser)

        }

   
      })


      app.post("/addClasses", async(req, res)=>{
        const data = req.body;
        console.log(data,"data");

       
            const result = await classesCollections.insertOne(data)
        
            res.send(result)
        
        console.log(result,'success'); 
        
        
       
      })


    

    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);



app.get('/', (req, res) => {
    res.send(' Musicy is running')
})

app.listen(port, () => {
    console.log(`Musicy Server is running on port ${port}`.red.underline.bold)
})