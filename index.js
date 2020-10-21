const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_PASSWORD}@cluster0.pjknv.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('service'));
app.use(fileUpload());

const port = 5000;
app.get('/', (req, res) => {
  res.send('Welcome from vlounteer network server!')
})
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const volunteerCollection = client.db("volunteerdb").collection("volunteer");
  const eventCollection = client.db("volunteerdb").collection("events");
  app.post('/addEvent', (req, res) => {
    const file = req.files.file;
    const title = req.body.title;
    const date = req.body.date;
    const description = req.body.description;
    const newImg = file.data;
    const encImg = newImg.toString('base64');

    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, 'base64')
    };

    eventCollection.insertOne({ title, date, description, image })
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  app.get('/events', (req, res) => {
    eventCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })
  app.post('/addRegistration', (req, res) => {
    console.log(req.body)
    const fullName = req.body.fullName;
    const email = req.body.email;
    const date = req.body.date;
    const description = req.body.description;
    const title = req.body.title;
    volunteerCollection.insertOne({ fullName, email, date, description, title })
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })
  app.get('/volunteers', (req, res) => {
    volunteerCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })
});

app.listen(port)

