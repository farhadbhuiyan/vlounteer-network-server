const express = require('express')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_PASSWORD}@cluster0.pjknv.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const app = express()
const port = 5000;
app.get('/', (req, res) => {
  res.send('Welcome from vlounteer network server!')
})
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const volunteerCollection = client.db("volunteerdb").collection("volunteer");
  app.post('/register', (req, res) => {
    const fullName = req.body.fullName;
    const email = req.body.email;
    const date = req.body.date;
    const description = req.body.description;
    const title = req.body.title;
    volunteerCollection.insertOne({ fullName, email, date, description, title  })
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })
});

app.listen(port)

