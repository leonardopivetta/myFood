const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { body, validationResult, param } = require('express-validator');

const MenuModel = require('./model/Menu.js')
const OrdineModel = require('./model/Ordine.js')

const app = express()
app.use(cors({ allowedHeaders: "*" }))
app.use(bodyParser.json())

// sockets
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

server.listen(3000, () => {
    console.log('sockets listening on *:3000');
});

// documentation
const swaggerJsDocs = require('swagger-jsdoc');
const swaggerUIExpress = require('swagger-ui-express');

const swaggerOptions = {
    // explorer: true, 
    swaggerDefinition: {
        info: {
            title: "MyFood API",
            description: "Documentazione API MyFood",
            version: "1.0.0"
        }
    },
    apis: ["app.js"]
}

const swaggerDocs = swaggerJsDocs(swaggerOptions)
app.use('/api-docs', swaggerUIExpress.serve, swaggerUIExpress.setup(swaggerDocs));


/**
 * @openapi
 * /{id_ristorante}/api/menu:
 *   get:
 *     summary: Recupero dati riguardanti il ristorante.
 *     description: "Recupero dei seguenti dati del ristorante: nome del ristorante, orari di apertura ed elenco dei piatti suddivisi per categoria."
 *     parameters:
 *       - in: path
 *         name: id_ristorante
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del ristorante a cui fa riferimento il menu da recuperare
 *     responses:
 *       200:
 *         description: Ritorna i dati richiesti in formato JSON.
 *       400:
 *         description: "L'id del ristorante passato come parametro è invalido."
 *       500:
 *         description: "Errore interno."
 */
app.get('/:id_ristorante/api/menu',
    param('id_ristorante').notEmpty().isString(),
    async (req, res) => {
        await MenuModel.findOne({
            "id_ristorante": req.params.id_ristorante
        }).then(doc => {
            if (doc == null) {
                res.status(400)
                res.send("failure. invalid id_ristorante")
            } else {
                res.status(200)
                res.send(doc)
            }
        }, err => {
            console.log(err)

            res.status(500)
            res.send("failure")
        }).catch(err => {
            console.error(err)

            res.status(500)
            res.send("an error occurred")
        })
    }
);

/**
 * @openapi
 * /{id_ristorante}/api/ordini:
 *   get:
 *     summary: Recupero degli ordini in attesa di conferma.
 *     description: "Recupero di tutti gli ordini che sono stati pagati dagli utenti e che aspettano di essere confermati o rifiutati da parte del ristoratore."
 *     parameters:
 *       - in: path
 *         name: id_ristorante
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del ristorante a cui fa riferimento il menu da recuperare
 *     responses:
 *       200:
 *         description: Ritorna i dati richiesti in formato JSON.
 *       500:
 *         description: "Errore interno."
 */
app.get('/:id_ristorante/api/ordini',
    param('id_ristorante').notEmpty().isString(),
    (req, res) => {
        OrdineModel.find({
            "id_ristorante": req.params.id_ristorante,
            "stato": "ATTESA_CONFERMA"
        }).then(doc => {
            // the document might be empty
            res.status(200)
            res.send(doc)
        }, err => {
            console.log(err)

            res.status(500)
            res.send("failure")
        }).catch(err => {
            console.error(err)

            res.status(500)
            res.send("an error occurred")
        })
    }
);

/**
 * @openapi
 * /{id_ristorante}/api/ordine/inserisci:
 *   post:
 *     summary: Memorizzazione di un ordine nel database.
 *     description: "Memorizzazione di un ordine nel database dopo che questo è stato effettuato da parte di un utente."
 *     parameters:
 *       - in: path
 *         name: id_ristorante
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del ristorante a cui fa riferimento il menu da recuperare
 *       - in: body
 *         name: req
 *         description: I dati da inserire.
 *         schema:
 *           type: object
 *           required:
 *             - orario_consegna
 *             - pagato
 *             - piatti
 *           properties:
 *             orario_consegna:
 *               type: string
 *               example: "12-12:30"
 *               description: "Indica l'orario in cui verrà consegnato l'ordine"
 *             indirizzo:
 *               type: string
 *               example: "Via Sommarive, 9, 38123 Povo,Trento TN"
 *               description: "L'indirizzo dove consegnare l'ordine"
 *             pagato:
 *               type: string 
 *               example: "3n66fk7sd5nlign56fim5g8mpi87nfg5mp7i"
 *               description: "L'identificativo del pagamento, se effettuato online."
 *             note:
 *               type: string 
 *               example: "Non suonare il campanello"
 *               description: "Note opzionali riguardanti l'ordine."
 *             piatti:
 *               type: array
 *               items: 
 *                 type: object
 *               description: "I piatti ordinati."
 *             carta_fedelta:
 *               type: object
 *               description: "La carta fedaltà utilizzata per lo sconto, se se ne fa uso."
 *     responses:
 *       201:
 *         description: "L'ordine è stato inserito con successo e ritorna l'ObjectId generato dal database (associato alla key 'id')."
 *       400:
 *         description: "Almeno un argomento del body e/o parameto della richiesta è invalido."
 *       500:
 *         description: "Errore interno."
 */
app.post('/:id_ristorante/api/ordine/inserisci',
    param('id_ristorante').notEmpty().isString(),
    body('orario_consegna').notEmpty(),
    body('indirizzo').notEmpty(),
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
            "indirizzo": req.body["indirizzo"],
            "pagato": req.body["pagato"],
            "note": req.body["note"] ?? "",
            "piatti": req.body["piatti"],
            "carta_fedelta": req.body["carta_fedelta"]
        })

        ordine.save().then(doc => {
            res.status(201)
            res.json({ id: doc._id })

            io.local.emit("newOrder");
        }, err => {
            console.log(err)

            res.status(500)
            res.send("failure")
        }).catch(err => {
            console.error(err)

            res.status(500)
            res.send("an error occurred")
        })
    }
);

/**
 * @openapi
 * /api/ordine/aggiorna_stato:
 *   post:
 *     summary: Aggiornamento dello stato dell'ordine.
 *     description: "Aggiornamento dello stato di un ordine già presente nel database."
 *     parameters:
 *       - in: body
 *         name: req
 *         description: I dati da aggiornare.
 *         schema:
 *           type: object
 *           required:
 *             - id
 *             - stato
 *           properties:
 *             id:
 *               type: string
 *               example: "61bb528320b24847630dac08"
 *               description: l'ID dell'ordine da aggiornare
 *             stato:
 *               type: string 
 *               example: "CONFERMATO"
 *               description: il nuovo stato che andrà a sostituire quello attualmente presente
 *     responses:
 *       200:
 *         description: "Ritorna 'success' ad indicare l'avvenuto aggiornamento."
 *       400:
 *         description: "Almeno un argomento del body è invalido."
 *       500:
 *         description: "Errore interno."
 */
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
                    res.status(500)
                    res.send("failure. invalid id")
                } else {
                    res.status(200)
                    res.send("success")
                }
            }, err => {
                console.log(err)

                res.status(500)
                res.send("failure")
            }).catch(err => {
                console.error(err)

                res.status(500)
                res.send("an error occurred")
            })
    }
);

/**
 * @openapi
 * /api/ordine/{_id}:
 *   delete:
 *     summary: Eliminazione di un ordine.
 *     description: "Eliminazione di un ordine dal database."
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: "ID dell'ordine da eliminare"
 *     responses:
 *       200:
 *         description: "Ritorna 'success' ad indicare l'avvenuta eliminazione."
 *       400:
 *         description: "L'id passato come parametro non non è valido."
 *       500:
 *         description: "Errore interno."
 */
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
                    res.status(400)
                    res.send("failure. invalid id")
                } else {
                    res.status(200)
                    res.send("success")
                }
            }, err => {
                console.log(err)

                res.status(500)
                res.send("failure")
            }).catch(err => {
                console.error(err)

                res.status(500)
                res.send("an error occurred")
            })
    }
);

module.exports = app;