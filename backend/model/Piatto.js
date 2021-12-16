var mongoose = require("mongoose");

const PiattoSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    nome: {
        type: String,
        required: true
    },
    prezzo: {
        type: Number,
        required: true
    },
    immagine: {
        type: String,
        required: true
    },
    ingredienti: {
        type: [String],
        required: true
    },
    note: {
        type: String,
        deafult: ""
    }
});

module.exports = mongoose.model('piatto', PiattoSchema)