var mongoose = require('mongoose')
var Pessoa = require('../model/index')

module.exports.list = () => {
    return Pessoa
        .find()
        .exec()
}

module.exports.insert = (pessoa) => {
    if ((Pessoa.find({_id: pessoa._id}).exec()).length != 1)
    {
        var newPessoa = new Pessoa(pessoa)
        return newPessoa.save()
    }
}

module.exports.delete = (id) => {
    return Pessoa.find({_id: id}).deleteOne().exec()
}

module.exports.update = (id, pessoa) => {
    return Pessoa.findByIdAndUpdate(id, pessoa, {new: true}).exec()
}

module.exports.listByModalidade = (modalidade) => {
    return Pessoa
        .find({ desportos: { $elemMatch: { $eq: modalidade } } })
        .exec()
}