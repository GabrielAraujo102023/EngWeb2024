var express = require('express');
var router = express.Router();
var axios = require('axios')

/* GET users listing. */
router.get('/:nomePeriodo', function (req, res, next) {
    var d = new Date().toISOString().substring(16)
    axios.get('http://localhost:3000/periodos?nome=' + req.params.nomePeriodo)
        .then(dados => {
            var periodo = dados.data[0]
            axios.get('http://localhost:3000/compositores?periodo=' + req.params.nomePeriodo)
            .then(cDados => {
                var compositores = cDados.data
                res.status(200).render('periodoPage', { 'periodo': periodo, 'd': d, 'compositores': compositores})
            })   
        })
        .catch(erro => {
            res.status(501).render('error', { 'error': erro })
        })
});

module.exports = router;