var mongoose = require('mongoose')

var pessoasSchema = new mongoose.Schema({
    nome: String,
    idade: Number,
    sexo: String,
    morada: {cidade: String, distrito: String},
    BI: String,
    CC: String,
    descrição: String,
    profissao: String,
    partido_politico: {party_abbr: String, party_name: String},
    religiao: String,
    desportos: [String],
    animais: [String],
    figura_publica_pt: [String],
    marca_carro: String,
    destinos_favoritos: [String],
    atributos: Map
}, {versionKey: false})

module.exports = mongoose.model('pubs', pessoasSchema)