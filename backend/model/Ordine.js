var mongoose = require("mongoose");

const PiattoSchema = require('./Piatto.js').schema;
const Schema = mongoose.Schema;

// subdocument schema

const CartaFedeltaSchema = new Schema({
    punti: {
        type: Number,
        default: 0
    },
    target_punti: Number,
    descrizione: String
});

// parent schema

var OrdineSchema = new Schema({
    creazione: {
        type: String,
        default: function() {
            return new Date().toLocaleDateString('it-IT');
        }
    },
    id_ristorante: {
        type: String,
        required: true
    },
    orario_consegna: {
        type: String, 
        required: true
    },
    indirizzo: {
        type: String, 
        required: true
    },
    stato: {
        type: String,
        default: "ATTESA_CONFERMA"
    },
    pagato: {
        type: String,
        default: ""
    },
    note: {
        type: String, 
        required: false
    },
    piatti: [PiattoSchema],
    carta_fedelta: {
        type: CartaFedeltaSchema,
        required: false
    }
}, { collection: 'ordini' });

module.exports = mongoose.model('ordine', OrdineSchema)