const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser')

var firebase = require("firebase/app");

require("firebase/auth");
require("firebase/database");
const firebaseConfig = {
    apiKey: "AIzaSyCMQMIGzB0XBstNMwhIAaFf3wjR_GX8aME",
    authDomain: "memory-matrix-3dd3a.firebaseapp.com",
    databaseURL: "https://memory-matrix-3dd3a.firebaseio.com",
    projectId: "memory-matrix-3dd3a",
    storageBucket: "memory-matrix-3dd3a.appspot.com",
    messagingSenderId: "9749002468",
    appId: "1:9749002468:web:1280e1e752dc38e84154f1",
    measurementId: "G-QFDSQYCNQJ"
};
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
var db = firebase.database().ref('users');

const dbref = firebase.database().ref().child('users')

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

    dbref.push(user)


    // res.redirect(301, "leaderboard.html")
    res.sendFile(path.join(__dirname + '/Views/leaderboard.html'));


})


app.get('/getUsers', (req, res) => {
    var obj = [];

    // dbref.orderByValue().on("value", function(snapshot) {
    //     snapshot.forEach(function(data) {

    //       //console.log("The id is " + data.val().id + " score is " + data.val().score);
    //       let id = String(data.val().id)
    //       let score = String(data.val().score)
    //       obj[id] = score


    //     });
    // })
    dbref.on('value', getUserData);

    function getUserData(data) {
        var users = data.val()
        var keys = Object.keys(users)
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i]
            //console.log(users[k].id + users[k].score)
            var name = users[k].id
            var score = users[k].score
            console.log(name + "       " + score)
            obj.push(name)
        }
    }
    console.log(obj)
    res.send(obj)

    // firebase.database().ref('/users').on('value', function(snapshot) {
    //     var obj = snapshot.exportVal()
    //     //res.json(obj)
    //     console.log(JSON.stringify(obj))
    //     res.json(JSON.stringify(obj))
    //     // res.json(obj)

    // });

    // res.json(objArr);
});


app.get('/getScores', (req, res) => {
    var obj = []

    dbref.on('value', getUserData);

    function getUserData(data) {
        var users = data.val()
        var keys = Object.keys(users)
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i]
            //console.log(users[k].id + users[k].score)
            var name = users[k].id
            var score = users[k].score
            console.log(name + "       " + score)
            obj.push(score)
        }
    }
    console.log(obj)
    res.send(obj)

})



app.post('/terminate', function (req, res) {
    res.sendFile(path.join(__dirname + '/Views/summary.html'));
})

app.use(express.static(path.join(__dirname, "public")));
