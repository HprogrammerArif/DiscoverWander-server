const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors({origin:["http://localhost:5173","https://discoverwander-16ac4.web.app"]}));
app.use(express.json());

//app.use (cors({origin:["localhost url","live link url"]}))

//DiscoverWonder
//pzqE0eoWVv7v2r5z

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.epjsucj.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
// const uri = "mongodb+srv://<username>:<password>@cluster0.epjsucj.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();

    // const database = client.db("insertDB");
    // const haiku = database.collection("haiku");

    const touristSpotCollection = client
      .db("touristSpotDB")
      .collection("touristSpot");

    app.get("/touristSpot", async (req, res) => {
      const cursor = touristSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // app.patch('/touristSpot', async(req, res) => {

    // })

    app.put("/touristSpot/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedSpot = req.body;
      const touristSpots = {
        $set: {
          name: updatedSpot.name,
          countryNames: updatedSpot.countryNames,
          location: updatedSpot.location,
          averageCost: updatedSpot.averageCost,
          seasonality: updatedSpot.seasonality,
          travelTime: updatedSpot.travelTime,
          totaVisitorsPerYear: updatedSpot.totaVisitorsPerYear,
          email: updatedSpot.email,
          photo: updatedSpot.photo,
          description: updatedSpot.description,
        },
      };
      const result = await touristSpotCollection.updateOne(
        filter,
        touristSpots,
        options
      );
      res.send(result);
    });

    app.get("/touristSpot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.findOne(query);
      res.send(result);
    });

    app.post("/touristSpot", async (req, res) => {
      const newTouristSpot = req.body;
      console.log(newTouristSpot);
      const result = await touristSpotCollection.insertOne(newTouristSpot);
      res.send(result);
    });

    app.delete("/touristSpot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Disconver Wonder is running");
});

app.listen(port, () => {
  console.log(`Discover Wonder is Running on Port ${port}`);
});
