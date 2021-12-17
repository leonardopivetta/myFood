const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { body, validationResult, param } = require('express-validator');

const database = require('./database.js');

const OrdineModel = require('./model/Ordine.js')
const MenuModel = require('./model/Menu.js')

const app = express()
app.use(cors({ allowedHeaders: "*" }))
app.use(bodyParser.json())

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// todo jsdocs

app.get('/:id_ristorante/api/menu',
    param('id_ristorante').notEmpty().isString(),
    (req, res) => {
        MenuModel.findOne({
            "id_ristorante": req.params.id_ristorante
        }).then(doc => {
            if (doc == null) {
                res.send("failure. invalid id_ristorante")
            } else {
                res.send(doc)
            }
        }, err => {
            res.send("failure")
            console.log(err)
        }).catch(err => {
            console.error(err)
            res.send("an error occurred")
        })
    }
);

app.get('/:id_ristorante/api/ordini',
    param('id_ristorante').notEmpty().isString(),
    (req, res) => {
        OrdineModel.find({
            "id_ristorante": req.params.id_ristorante,
            "stato": "ATTESA_CONFERMA"
        }).then(doc => {
            res.send(doc)
        }, err => {
            res.send("failure")
            console.log(err)
        }).catch(err => {
            console.error(err)
            res.send("an error occurred")
        })
    }
);

app.post('/:id_ristorante/api/ordine/inserisci',
    param('id_ristorante').notEmpty().isString(),
    body('orario_consegna').notEmpty(),
    body('pagato').notEmpty().isString(),
    body('piatti').notEmpty().isArray(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let ordine = new OrdineModel({
            "id_ristorante": req.params.id_ristorante,
            "orario_consegna": req.body["orario_consegna"],
            "pagato": req.body["pagato"],
            "piatti": req.body["piatti"],
            "carta_fedelta": req.body["carta_fedelta"]
        })

        ordine.save().then(doc => {
            res.send("success")

            io.local.emit("newOrder");
        }, err => {
            res.send("failure")
            console.log(err)
        }).catch(err => {
            console.error(err)
            res.send("an error occurred")
        })
    }
);

app.post('/api/ordine/aggiorna_stato',
    body('id').notEmpty().isString(),
    body('stato').notEmpty().isString(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        OrdineModel.findByIdAndUpdate(req.body["id"],
            {
                $set: {
                    "stato": req.body["stato"]
                }
            }).then(doc => {
                if (doc == null) {
                    // the specified order doesn't exist
                    res.send("failure. invalid id")
                } else {
                    res.send("success")
                }
            }, err => {
                res.send("failure")
                console.log(err)
            }).catch(err => {
                console.error(err)
                res.send("an error occurred")
            })
    }
);

app.delete('/api/ordine/elimina/:_id',
    param('_id').notEmpty().isString(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        OrdineModel.findByIdAndDelete(req.params._id)
            .then(doc => {
                if (doc == null) {
                    // the specified order doesn't exist
                    res.send("failure. invalid id")
                } else {
                    res.send("success")
                }
            }, err => {
                res.send("failure")
                console.log(err)
            }).catch(err => {
                console.error(err)
                res.send("an error occurred")
            })
    }
);

server.listen(3000, () => {
    console.log('listening on *:3000');
});

app.listen(4001);
module.exports = app;