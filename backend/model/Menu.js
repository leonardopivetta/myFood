var mongoose = require("mongoose");

const PiattoSchema = require('./Piatto.js').schema;
const Schema = mongoose.Schema;

// subdocument schema

const CategoriaSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    piatti: {
        type: [PiattoSchema],
        required: true
    },
});

// parent schema

var MenuSchema = new Schema({
    id_ristorante: {
        type: String,
        required: true
    },
    apertura: {
        type: [], // todo change data type (?)
        required: true
    },
    categorie: {
        type: [CategoriaSchema],
        required: true
    }
}, { collection: 'menu' });

module.exports = mongoose.model('menu', MenuSchema)