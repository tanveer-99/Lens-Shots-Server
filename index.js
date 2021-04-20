const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const app = express()
const port = 5000


app.use(bodyParser.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2gqn9.mongodb.net/lensshotsdatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



client.connect(err => {
  const servicesCollection = client.db("lensshotsdatabase").collection("servicescollection");

  app.get('/services', (req, res)=> {
    servicesCollection.find({})
    .toArray( (err, documents) => {
      res.send(documents)
    })
  })

  app.get('/dashboard/:serviceName', (req, res)=> {
    console.log(req.params.serviceName);
    servicesCollection.find({serviceName : req.params.serviceName})
    .toArray( (err, documents) => {
      res.send(documents)
    })
  })

});


client.connect(err => {
  const TestimonialCollection = client.db("lensshotsdatabase").collection("TestimonialCollection");

  app.get('/testimonials', (req, res)=> {
    TestimonialCollection.find({})
    .toArray( (err, documents) => {
      res.send(documents)
    })
  })

  app.post('/postReview', (req, res)=> {
    TestimonialCollection.insertOne(req.body);
  })
 
  

});

client.connect(err => {
  const bookingList = client.db("lensshotsdatabase").collection("BookingList");

  app.post('/BookAService', (req, res)=> {
    bookingList.insertOne(req.body);
  })

  app.get('/OrderedServices', (req, res)=> {
    bookingList.find({email : req.query.email})
    .toArray((err, documents)=> {
      res.send(documents);
    })
  })
 
  

});



app.get('/', (req, res) => {
  res.send('Hello World!')
})






app.listen(port || process.env.PORT )

