const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const { body, validationResult, param } = require('express-validator');

app.use(cors({allowedHeaders: "*"}))
app.use(bodyParser.json())

const { MongoClient, ObjectId } = require('mongodb');

// Connection URL
const url = 'mongodb://173.249.17.85:27017';
const client = new MongoClient(url);
let database;

// Database Name
const dbName = 'myfood';

async function setup() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  database = client.db(dbName);

  // the following code examples can be pasted here...
  return 'done.';
}

// todo socket, jsdocs

app.get('/api/menu', (req, res) => {

    database.collection("menu").find({}).toArray((error, result) => {
        if (error) {
            console.log(error)
        }

        res.send(result)
    })
});

app.get('/api/ordini', (req, res) => {

    database.collection("ordini").find({
        "stato": "IN_PREPARAZIONE"
    }).toArray((error, result) => {
        if (error) {
            console.error(error)
        }

        res.send(result)
    })
});

app.post('/api/ordine/inserisci', 
    body('orario_consegna').notEmpty(),
    body('pagato').notEmpty().isString(),
    body('piatti').notEmpty().isArray(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        database.collection("ordini").insertOne({
            "data": new Date().toLocaleDateString('it-IT'),
            "orario_consegna": req.body["orario_consegna"],
            "stato": "ATTESA_CONFERMA",
            "pagato": req.body["pagato"], 
            "piatti": req.body["piatti"],
            "carta_fedelta": req.body["carta_fedelta"]
        }).then((insertRes) => {
            if (insertRes["acknowledged"]) {
                res.send("success")
            } else {
                res.send("failure")   
            }
        })
});

app.post('/api/ordine/aggiorna_stato', 
    body('id').notEmpty().isString(),
    body('stato').notEmpty().isString(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        database.collection("ordini").updateOne({
            "_id": ObjectId(req.body["id"])
        }, {$set:{
            "stato": req.body["stato"]
        }}).then((updateRes) =>  {
            if (updateRes["modifiedCount"] == 1) {
                res.send("success") 
            } else {
                res.send("failure")   
            }
        })
});

app.delete('/api/ordine/elimina/:_id', 
    param('_id').notEmpty().isString(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        database.collection("ordini").deleteOne({
            "_id": ObjectId(req.params._id)
        }).then((deleteRes) => {
            if (deleteRes["deletedCount"] > 0) {
                res.send("success")    
            } else {
                res.send("failure")   
            }
        });
});

app.listen(4001, setup);