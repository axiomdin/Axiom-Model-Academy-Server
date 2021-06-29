const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload')
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xpzdq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('subjects'));
app.use(fileUpload());

const port = 5000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const studentCollection = client.db("educationalCenter").collection("student");
  const subjectCollection = client.db("educationalCenter").collection("subject");
  const reviewCollection = client.db("educationalCenter").collection("review");
  const adminCollection = client.db("educationalCenter").collection("admin");



  app.post('/addAdmin', (req, res) => {
    const admin = req.body;
    //console.log(admin)
    adminCollection.insertOne(admin)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.post('/admin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({email: email})
    .toArray((err, documents)=> {
      res.send(documents.length > 0)
    })
  })





  app.post('/addStudent', (req, res) => {
    const student = req.body;
    console.log(student)
    studentCollection.insertOne(student)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/students', (req, res) => {
    // console.log(req.query.email);
    studentCollection.find()
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  app.get('/student', (req, res) => {
    // console.log(req.query.email);
    studentCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  app.get('/subject', (req, res) => {
    subjectCollection.find({})
      .toArray((err, subject) => {
        res.send(subject);
      })
  })


  app.post('/addSubject', (req, res) => {
    const newSubject = req.body;
    console.log('adding new product', newSubject)
    subjectCollection.insertOne(newSubject)
      .then(result => {
        console.log('inserted count', result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/subject/:id', (req, res) => {
    const id = req.params.id;
    subjectCollection.find({ _id: ObjectId(id) })
      .toArray((err, documents) => {
        res.send(documents[0])
      })
  })




  app.post('/addReview', (req, res) => {
    const newReview = req.body;
    console.log('adding new product', newReview)
    reviewCollection.insertOne(newReview)
      .then(result => {
        console.log('inserted count', result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })


  app.get('/reviews', (req, res) => {
    reviewCollection.find({})
      .toArray((err, review) => {
        res.send(review);
      })
  })

  app.delete('/deleteSubject/:id' , (req , res) =>{
    console.log( req.params.id);
    const SubjectId = req.params.id;
    subjectCollection.deleteOne({ _id: ObjectId(SubjectId) })
      .then((err, result) => {
        console.log(result.deleteCount > 0);
      })
  })



  ///

});

app.listen(process.env.PORT || port)