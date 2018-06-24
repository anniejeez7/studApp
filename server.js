var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
 var dbo = db.db("mydb");
  dbo.createCollection("students", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});


const express = require('express');
var bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.listen(3000, function() {
  console.log('listening on 3000');
});
app.use('/static', express.static(__dirname+ '/public'));
//app.use('/ui-router.js',require(__dirname+'/ui-router.js'));
app.get('/', function(req, res) {
res.sendFile(__dirname + '/index.html')
});
app.post('/addStudent',function(req, res){	
	console.log("In POST");
	console.log(req.body);
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	 var dbo = db.db("mydb");
	dbo.collection("students").insertOne(req.body, function(err, res) {
    if (err) throw err;
    console.log("1 student inserted");
    db.close();
  });
	});
});

app.get('/getStudents',function(req, res){
	console.log("In GET");
	var resultSet;
	MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("students").find({}).toArray(function(err, result) {
    if (err) throw err;
    //console.log(result);
    db.close();
		res.send(result);
  });
});

});