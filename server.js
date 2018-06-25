var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/";
var url = "mongodb://ann:userann123@ds161520.mlab.com:61520/mongo_angular"
var ObjectID = require('mongodb').ObjectID;
MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var dbo = db.db("mongo_angular");
  dbo.createCollection("students", function (err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});


const express = require('express');
var bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(3000, function () {
  console.log('listening on 3000');
});
app.use('/static', express.static(__dirname + '/public'));
//app.use('/ui-router.js',require(__dirname+'/ui-router.js'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
});
app.post('/addStudent', function (req, res) {
  console.log("In POST");
  console.log(req.body);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mongo_angular");
    dbo.collection("students").insertOne(req.body, function (err, res) {
      if (err) throw err;
      console.log("1 student inserted");
      db.close();
    });
  });
});

app.get('/getStudents', function (req, res) {
  console.log("In GET");
  var resultSet;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mongo_angular");
    dbo.collection("students").find({}).toArray(function (err, result) {
      if (err) throw err;
      //console.log(result);
      db.close();
      res.send(result);
    });
  });
  app.post('/updateStudent', function (req, res) {
    console.log("In UPDATE");
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("mongo_angular");
      console.log("Req ID ");
      console.log(req.body);
      var myquery = { _id: ObjectID(req.body._id) };
      var newvalues = { $set: { name: req.body.name, id: req.body.id, dob: req.body.dob } };
      var query = { _id: ObjectID(req.body._id) };
      dbo.collection("students").find(query).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
      });
      dbo.collection("students").updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
        db.close();
      });
    });
  });
    app.post('/deleteStudent', function (req, res) {
      console.log("In DELETE");
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mongo_angular");
        console.log("Req ID ");
        var myquery = { _id: ObjectID(req.body._id) };
        dbo.collection("students").deleteOne(myquery, function (err, obj) {
          if (err) throw err;
          console.log("1 document deleted");
          db.close();
        });
      });
    });
  });