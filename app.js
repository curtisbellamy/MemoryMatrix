const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser')

const MongoClient = require('mongodb').MongoClient;

// replace the uri string with your connection string.
const uri = "mongodb+srv://curtisbellamy:trek4300@scoreboard-tg46s.mongodb.net/test?retryWrites=true&w=majority"

const PORT = process.env.PORT || 3000

app.listen(PORT, function () {
    console.log('Server started on port 3000...');
});




var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/Views/index.html'));
    // res.sendFile(path.join(__dirname + '/Views/summary.html'));
    // res.sendFile(path.join(__dirname + '/Views/leaderboard.html'));



})

app.post('/submitScore', (req, res) => {
    let username = req.body.username
    let score = req.body.score
    let user = {
        id: username,
        score: score
    }
    MongoClient.connect(uri, function (err, client) {
        if (err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
        }
        console.log('Connected...');
        const collection = client.db("ScoreBoard").collection("users");
        // perform actions on the collection object
        collection.insertOne(user)
        client.close();
    });



    // res.redirect(301, "leaderboard.html")
    res.sendFile(path.join(__dirname + '/Views/leaderboard.html'));


})


app.get('/getUsers', (req, res) => {

    MongoClient.connect(uri, function (err, client) {
        if (err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
        }
        console.log('Connected...');
        const collection = client.db("ScoreBoard").collection("users");
        // perform actions on the collection object

        collection.find({}).toArray(function (err, results) {
            var obj = []
            for (let i = 0; i < results.length; i++) {
                let name = results[i].id
                let score = results[i].score
                obj.push({ id: name, points: score })

            }
            JSON.stringify(obj)
            obj.sort(function (a, b) {
                return b.points - a.points;
            });
            userObj = obj.slice(0, 5)
            res.send(userObj)

        });

        client.close();
    });
});




app.post('/terminate', function (req, res) {
    res.sendFile(path.join(__dirname + '/Views/summary.html'));
})

app.use(express.static(path.join(__dirname, "public")));
