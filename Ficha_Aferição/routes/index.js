var express = require('express');
var router = express.Router();
var Pessoa = require('../controllers/index')

router.get('/', function(req, res, next) {
  Pessoa.list()
  .then(data => res.jsonp(data))
  .catch(erro => res.jsonp(erro))
});

router.post('/', function(req, res, next) {
  Pessoa.insert(req.body)
  .then(data => res.jsonp(data))
  .catch(erro => res.jsonp(erro))
});

router.put('/:id', function(req, res, next) {
  Pessoa.update(req.params.id, req.body)
  .then(data => res.jsonp(data))
  .catch(erro => res.jsonp(erro))
});

router.delete('/:id', function(req, res, next) {
  Pessoa.delete(req.params.id)
  .then(data => {
    console.log('Deletes ' + req.params.id)
    res.jsonp(data)
  })
  .catch(erro => res.jsonp(erro))
});

router.get('/modalidades', function(req, res, next)
{
  Pessoa.list()
  .then(pessoas => {
    let modalidades = []
    pessoas.forEach(pessoa => {
        pessoa.desportos.forEach(modalidade => {
          if (!modalidades.includes(modalidade)) {
            modalidades.push(modalidade)
          }
        })
    })
    modalidades.sort()
    res.jsonp(modalidades)
  })
})

router.get('/modalidades/:mod', function(req, res, next) {
  Pessoa.listByModalidade(req.params.mod)
  .then(data => res.jsonp(data))
  .catch(erro => res.jsonp(erro))
})

module.exports = router;