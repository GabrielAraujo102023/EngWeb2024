var http = require('http')
var url = require('url')
var axios = require('axios')

http.createServer((req, res) => {
    console.log(req.method + ' ' + req.url)

    var q = url.parse(req.url, true)
    if (q.pathname == '/alunos/')
    {
        axios.get('http://localhost:3000/alunos?_sort=nome')
        .then(d => {
            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})  
            res.write('<ul>')
            for(i in d.data)
            {
                res.write('<li><a href="/alunos/' + d.data[i].id + '">' + d.data[i].nome + '</a></li>')
            }
            res.write('<ul>')
            res.end()
        })
        .catch(erro => {
            res.write('Erro')
            res.end()
        })
    }
    else if (q.pathname == '/instrumentos/')
    {
        axios.get('http://localhost:3000/instrumentos?_sort=text')
        .then(d => {
            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})  
            res.write('<ul>')
            for(i in d.data)
            {
                res.write('<li><a href="/instrumentos/' + d.data[i].text + '">' + d.data[i].text + '</a></li>')
            }
            res.write('<ul>')
            res.end()
        })
        .catch(erro => {
            res.write('Erro')
            res.end()
        })
    }
    else if (q.pathname == '/cursos/')
    {
        axios.get('http://localhost:3000/cursos?_sort=designacao')
        .then(d => {
            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})  
            res.write('<ul>')
            for(i in d.data)
            {
                res.write('<li><a href="/cursos/' + d.data[i].id + '">' + d.data[i].designacao + '</a></li>')               
            }
            res.write('<ul>')
            res.end()
        })
        .catch(erro => {
            res.write('Erro')
            res.end()
        })
    }
    else if (q.pathname.match(/\/cursos\/(CB|CS)\d+/) )
    {
        var lh = 'http://localhost:3000/cursos?id=' + q.pathname.substring(8)
        console.log(lh)
        axios.get(lh)
        .then(d => {
            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})  
            for(i in d.data){
                res.write('<p>ID: ' + d.data[i].id + '</p>')
                res.write('<p>Designação: ' + d.data[i].designacao + '</p>')
                res.write('<p>Duração: ' + d.data[i].duracao + '</p>')
                res.write('<p>Instrumento: <a href="/instrumentos/' + d.data[i].instrumento.text + '">' + d.data[i].instrumento.text +'</a></p>')
            }
            res.end()
        })
        .catch(erro => {
            res.write('Erro')
            res.end()
        })
    }
    else if (q.pathname.match(/\/alunos\/A\d+/))
    {
        var lh = 'http://localhost:3000/alunos?id=A' + q.pathname.substring(9)
        console.log(lh)
        axios.get(lh)
        .then(d => {
            
            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})  
            for(i in d.data){
                res.write('<p>ID: ' + d.data[i].id + '</p>')
                res.write('<p>Nome: ' + d.data[i].nome + '</p>')
                res.write('<p>Data de nascimento: ' + d.data[i].dataNasc + '</p>')
                res.write('<p>Curso: <a href="/cursos/' + d.data[i].curso + '">' + d.data[i].curso +'</a></p>')
                res.write('<p>Ano do curso:' + d.data[i].anoCurso + '</p>')
                res.write('<p>Instrumento: <a href="/instrumentos/' + d.data[i].instrumento + '">' + d.data[i].instrumento +'</a></p>')
            }
            res.end()
        })
        .catch(erro => {
            res.write('Erro')
            res.end()
        })
    }
    else if (q.pathname.match(/\/instrumentos\/\w+/)){
        var lh = 'http://localhost:3000/instrumentos?text=' + q.pathname.substring(14)
        console.log(lh)
        axios.get(lh)
        .then(d => {
            
            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})  
            for(i in d.data){
                res.write('<p>ID: ' + d.data[i].id + '</p>')
                res.write('<p>Nome: ' + d.data[i].text + '</p>')
            }
            res.end()
        })
        .catch(erro => {
            res.write('Erro')
            res.end()
        })
    }
    else
    {
        res.write('Erro...')
        res.end()
    }
}).listen(7777)

console.log('Servidor à escuta no port 7777')
