var http = require('http')
var axios = require('axios')
const { parse } = require('querystring');

var templates = require('./public/templates.js')          // Necessario criar e colocar na mesma pasta
var static = require('./public/static.js')             // Colocar na mesma pasta

// Aux functions
function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}

// Server creation

var alunosServer = http.createServer((req, res) => {
    // Logger: what was requested and when it was requested
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Handling request
    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        switch(req.method){
            case "GET": 
                // GET /compositores --------------------------------------------------------------------
                if (req.url == '/' || req.url == '/alunos')
                {
                    axios.get('http://localhost:3000/compositores?_sort=nome')
                    .then(dados => {
                        var compositores = dados.data
                        res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
                        res.write(templates.compositoresListPage(compositores, d))
                        res.end()
                    })
                    .catch(erro => {
                        res.writeHead(501, {'Content-type' : 'text/html;charset=utf-8'})
                        res.write('<p>Não foi possível obter a lista decompositores<p/>')
                        res.write('<p>' + erro + '<p/>')
                        res.end()
                    })
                }
                // GET /compositores/:id --------------------------------------------------------------------
                else if (req.url.match(/\/compositores\/C[0-9]+$/i))
                {
                    axios.get('http://localhost:3000/compositores?id=' + req.url.substring(14))
                    .then(dados => {
                        var compositores = dados.data
                        res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
                        res.write(templates.compositoresListPage(compositores, d))
                        res.end()
                    })
                    .catch(erro => {
                        res.writeHead(501, {'Content-type' : 'text/html;charset=utf-8'})
                        res.write('<p>Não foi possível obter a lista de compositores<p/>')
                        res.write('<p>' + erro + '<p/>')
                        res.end()
                    })
                }
                // GET /compositores/edit/:id --------------------------------------------------------------------
                else if (/\/compositores\/edit\/C[0-9]+$/i.test(req.url))
                {
                    var idCompositor = req.url.split('/')[3]
                    axios.get('http://localhost:3000/compositores/' + idCompositor)
                    .then(dados => {
                        var compositores = dados.data
                        res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
                        res.write(templates.compositorEditFormPage(compositores, d))
                        res.end()
                    })
                    .catch(erro => {
                        res.writeHead(501, {'Content-type' : 'text/html;charset=utf-8'})
                        res.write('<p>Não foi possível obter a lista de compositores<p/>')
                        res.write('<p>' + erro + '<p/>')
                        res.end()
                    })
                }
                else if (req.url == '/periodos/')
                {
                    axios.get('http://localhost:3000/periodos/')
                    .then(dados => {
                        var periodos = dados.data
                        res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
                        res.write(templates.periodosListPage(periodos, d))
                        res.end()
                    })
                    .catch(erro => {
                        res.writeHead(501, {'Content-type' : 'text/html;charset=utf-8'})
                        res.write('<p>Não foi possível obter a lista decompositores<p/>')
                        res.write('<p>' + erro + '<p/>')
                        res.end()
                    })
                }
                else if (req.url.match(/\/periodos\/[0-9]+$/i))
                {
                    axios.get('http://localhost:3000/periodos?id=' + req.url.substring(10))
                    .then(dados => {
                        var periodos = dados.data
                        res.writeHead(200, {'Content-Type' : 'text/json;charset=utf-8'})
                        res.write(JSON.stringify(periodos))
                        res.end()
                    })
                    .catch(erro => {
                        res.writeHead(501, {'Content-type' : 'text/html;charset=utf-8'})
                        res.write('<p>Não foi possível obter a lista de compositores<p/>')
                        res.write('<p>' + erro + '<p/>')
                        res.end()
                    })
                }
                // GET /compositores/delete/:id --------------------------------------------------------------------
                else if (/\/compositores\/delete\/C[0-9]+$/i.test(req.url))
                {
                }
                // GET ? -> Lancar um erro
                else
                {
                    res.writeHead(200, {'Content-type' : 'text/html;charset=utf-8'})
                    res.write('<p>Método não suportado: ' + req.method + "<p/>")
                    res.write('<p><a href="/">Return<a/><p/>')
                    res.end()
                }
                break
            case "POST":
                // POST /compositores/registo --------------------------------------------------------------------
                if (req.url == '/compositores/registo')
                {
                    collectRequestBodyData(req, result => {
                        if (result)
                        {
                            axios.post('http://localhost:3000/compositores', result)
                            .then(resp => {
                                console.log(resp.data)
                                res.writeHead(200, {'Content-type' : 'text/html;charset=utf-8'})
                                res.end('<p>Registo inserido: ' + JSON.stringify(resp.data) + '</p>')
                            })
                            .catch(erro => {
                                res.writeHead(501, {'Content-type' : 'text/html;charset=utf-8'})
                                res.write('<p>Não foi possível obter os dados do body<p/>')
                                res.write('<p>' + erro + '<p/>')
                                res.end()
                            })
                        }
                        else
                        {
                            res.writeHead(501, {'Content-type' : 'text/html;charset=utf-8'})
                            res.write('<p>Não foi possível obter os dados do body<p/>')
                            res.end()
                        }
                    })
                }
                // POST /compositores/edit/:id --------------------------------------------------------------------
                else if (/\/compositores\/edit\/C[0-9]+$/i.test(req.url))
                {
                    collectRequestBodyData(req, result => {
                        if (result)
                        {
                            axios.put('http://localhost:3000/compositores/' + result.id, result)
                            .then(resp => {
                                console.log(resp.data)
                                res.writeHead(200, {'Content-type' : 'text/html;charset=utf-8'})
                                res.end('<p>Registo inserido: ' + JSON.stringify(resp.data) + '</p>')
                            })
                            .catch(erro => {
                                res.writeHead(501, {'Content-type' : 'text/html;charset=utf-8'})
                                res.write('<p>Não foi possível atualizar o aluno<p/>')
                                res.write('<p>' + erro + '<p/>')
                                res.end()
                            })
                        }
                        else
                        {
                            res.writeHead(501, {'Content-type' : 'text/html;charset=utf-8'})
                            res.write('<p>Não foi possível obter os dados do body<p/>')
                            res.end()
                        }
                    })
                }
                // POST ? -> Lancar um erro
                else
                {
                    res.writeHead(200, {'Content-type' : 'text/html;charset=utf-8'})
                    res.write('<p>Método não suportado: ' + req.method + "<p/>")
                    res.write('<p><a href="/">Return<a/><p/>')
                    res.end()
                }
                break
            default: 
                // Outros metodos nao sao suportados
                res.writeHead(501, {'Content-type' : 'text/html;charset=utf-8'})
                res.write('<p>Método não suportado: ' + req.method + "<p/>")
                res.end()
                break
        }
    }
})

alunosServer.listen(7777, ()=>{
    console.log("Servidor à escuta na porta 7777...")
})


