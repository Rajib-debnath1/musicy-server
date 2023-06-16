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
   


    const usersCollections = client.db("musicyDB").collection("users");
    const classesCollections = client.db("musicyDB").collection("classes");
    const selectedCollections = client.db("musicyDB").collection("selected");

    // addUsers from firebase
    app.post("/addUsers", async (req, res) => {
      const data = req.body;
      console.log(data, "data");
      const getUser = await usersCollections.findOne({ email: data.email })
      if (!getUser?.email) {
        const result = await usersCollections.insertOne(data)
        if (result) {
          res.send(result)
        }
        console.log(result, 'success');
      }
      else {
        res.send({ error: 'already added user in db' })
      }

    })


    app.get('/allUsers', async (req, res) => {
      const query = {}
      const result = await usersCollections.find(query).toArray();
      res.send(result)
    })




    app.put('/changeRole', async (req, res) => {
      const { id, role: newRole } = req.body

      const filter = { _id: new ObjectId(id) }

      // const filter2={email:req.body.email}

      const updaterDoc = {
        $set: {
          role: newRole
        }
      }

      console.log(filter, 'data');
      const result = await usersCollections.updateOne(filter, updaterDoc);
      console.log(result);
      res.send(result)
    })

    app.get('/checkRole/:email', async (req, res) => {
      const query = { email: req.params.email }
      console.log(query, "query for role");
      if (req.params.email) {
        const getUser = await usersCollections.findOne(query);

        res.status(200).json(getUser)

      }


    })


    app.post("/addClasses", async (req, res) => {
      const data = req.body;
      console.log(data, "data");


      const result = await classesCollections.insertOne(data)

      res.send(result)

      console.log(result, 'success');



    })

    app.post("/selectClass", async (req, res) => {
      const data = req.body;
      console.log(data, "data");


      const result = await selectedCollections.insertOne(data)

      res.send(result)

      console.log(result, 'success');


    })


    app.get('/addClasses', async (req, res) => {
      const query = {}
      const result = await classesCollections.find(query).toArray();
      res.send(result)
    })


    app.get('/myclass/:email', async (req, res) => {
      const query = {
        user: req.params.email
      }

      console.log(query, "query in myClass");

      if (req.params.email) {
        const getClass = await selectedCollections.find(query).toArray();
        res.status(200).json(getClass)

      }



    })

    app.delete('/deleteClass', async (req, res) => {
      const data = req.body;
      const name= data?.name;
      // const query = { _id: new ObjectId(id) };
      const query = { name:name};
    
      if (name) {
        const result = await selectedCollections.deleteOne(query);
        res.send(result);
      }
    
      console.log(query);
    });

// all instrunctor ///


app.get('/allinstructor', async (req, res) => {
  const query = {
    role: "instructor"
  }

  console.log(query, "query in myClass");

  const getUser = await usersCollections.find(query).toArray();
  res.status(200).json(getUser)

})

app.get('/instructorclass/:email', async (req, res) => {
  const query = {
    email: req.params.email
  }

  console.log(query, "query in myClass");

  if (req.params.email) {
    const getClass = await classesCollections.find(query).toArray();
    res.status(200).json(getClass)
    
    // console.log(getClass);
  }
})


app.put('/updateClass',async(req,res)=>{
  const data =req?.body
  const filter ={name:data.name}
  const updaterDoc={
    $set:{
      name:data.name,
      img:data.img,
      seats:data.seats,
      price:data.price
    }
  }
  // console.log(updaterDoc,"update");

  const result =await classesCollections.updateOne(filter,updaterDoc)
    res.send(updaterDoc)
    console.log(result);

})



app.get('/manageClasss', async (req, res) => {
  const query =  {}

  console.log(query, "query in myClass");

  const getUser = await classesCollections.find(query).toArray();
  res.status(200).json(getUser)

  }
  )

  

app.put('/updateManageClass',async(req,res)=>{
  const data =req?.body

  

  const filter ={name:data.name}

  const updaterDoc={
    $set:{
      status:data.status
    }
  }
  console.log(updaterDoc,"update",filter);

  const result =await classesCollections.updateOne(filter,updaterDoc)
    res.send(result)
    console.log(result);

})




app.put('/updateUpdateNew',async(req,res)=>{
  const data =req?.body

  

  const filter ={name:data.name}

  const updaterDoc={
    $set:{
      status:data.status
    }
  }
  console.log(updaterDoc,"update",filter);

  const result =await classesCollections.updateOne(filter,updaterDoc)
    res.send(result)
    console.log(result);

})


app.put('/feedback',async(req,res)=>{
  const data =req?.body

  // console.log(data,"manage")

  const filter ={name:data.name}

  const updaterDoc={
    $set:{
      feedback:data.feedback
    }
  }
  // console.log(updaterDoc,"update",filter,data);

  const result =await classesCollections.updateOne(filter,updaterDoc,{upsert:true})
    res.send(result)
    console.log(result);
})
  
await client.db("admin").command({ ping: 1 });

console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } finally {
    // Ensures that the client will close when you finish/error
    //   await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Musiqy is running')
})

app.listen(port, () => {
  console.log(`Musiqy is sitting on port ${port}`);
})
