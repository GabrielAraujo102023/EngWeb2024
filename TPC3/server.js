var http = require('http')
var url = require('url')
var axios = require('axios')

http.createServer((req, res) => {
    console.log(req.method + ' ' + req.url)

    var q = url.parse(req.url, true)
    if (q.pathname == '/movies/') {
        axios.get('http://localhost:3000/movies?_sort=title')
            .then(d => {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })

                res.write('<ul>')
                for (i in d.data) {
                    res.write('<li><a href="/movies/' + d.data[i].id + '">' + d.data[i].title + '</a></li>')
                }
                res.write('<ul>')

                res.end()
            })
            .catch(erro => {
                res.write('Erro')
                res.end()
            })
    }
    else if (q.pathname == '/actors/') {
        axios.get('http://localhost:3000/actors?_sort=name')
            .then(d => {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })

                res.write('<ul>')
                for (i in d.data) {
                    res.write('<li><a href="/actors/' + d.data[i].name + '">' + d.data[i].name + '</a></li>')
                }
                res.write('<ul>')

                res.end()
            })
            .catch(erro => {
                res.write('Erro')
                res.end()
            })
    }
    else if (q.pathname == '/genres/') {
        axios.get('http://localhost:3000/genres?_sort=name')
            .then(d => {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })

                res.write('<ul>')
                for (i in d.data) {
                    res.write('<li><a href="/genres/' + d.data[i].name + '">' + d.data[i].name + '</a></li>')
                }
                res.write('<ul>')

                res.end()
            })
            .catch(erro => {
                res.write('Erro')
                res.end()
            })
    }
    else if (q.pathname.match(/\/movies\/.+/)) {
        var lh = 'http://localhost:3000/movies?id=' + q.pathname.substring(8)
        console.log(lh)
        axios.get(lh)
            .then(d => {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
                for (i in d.data) {
                    res.write('<p>ID: ' + d.data[i].id + '</p>')
                    res.write('<p>Title: ' + d.data[i].title + '</p>')
                    res.write('<p>Year: ' + d.data[i].year + '</p>')
                    if (d.data[i].cast.length > 0) {
                        res.write('<p>Cast:</p>')
                        for (j in d.data[i].cast) {
                            res.write('<p>  <a href="/actors/' + d.data[i].cast[j] + '">' + d.data[i].cast[j] + '</a></p>')
                        }
                    }
                    if (d.data[i].genres.length > 0) {
                        res.write('<p>Genres:</p>')
                        for (j in d.data[i].genres) {
                            res.write('<p>  <a href="/genres/' + d.data[i].genres[j] + '">' + d.data[i].genres[j] + '</a></p>')
                        }
                    }
                }
                res.end()
            })
            .catch(erro => {
                res.write('Erro')
                res.end()
            })
    }
    else if (q.pathname.match(/\/actors\/.+/)) {
        var actor = q.pathname.substring(8)
        var lh = 'http://localhost:3000/actors?name=' + actor
        console.log(lh)
        axios.get(lh)
            .then(d => {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
                for (i in d.data) {
                    res.write('<p>ID: ' + d.data[i].id + '</p>')
                    res.write('<p>Name: ' + d.data[i].name + '</p>')
                }
                axios.get('http://localhost:3000/movies/')
                    .then(d => {
                        res.write('<p>Movies with this actor:</p>')
                        console.log(actor)
                        let ac = decodeURIComponent(actor)
                        for (i in d.data) {
                            if (d.data[i].cast && d.data[i].cast.length > 0) {
                                if (d.data[i].cast.includes(ac)) {
                                    res.write('<p>  <a href="/movies/' + d.data[i].id + '">' + d.data[i].title + '</a></p>')
                                }
                            }
                        }
                        res.end()
                    })
                    .catch(erro => {
                        res.write('Erro.')
                        res.end()
                    })
            })
            .catch(erro => {
                res.write('Erro')
                res.end()
            })
    }
    else if (q.pathname.match(/\/genres\/.+/)) {
        var genre = q.pathname.substring(8)
        var lh = 'http://localhost:3000/genres?name=' + genre
        console.log(lh)
        axios.get(lh)
            .then(d => {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
                for (i in d.data) {
                    res.write('<p>ID: ' + d.data[i].id + '</p>')
                    res.write('<p>Name: ' + d.data[i].name + '</p>')
                }
                axios.get('http://localhost:3000/movies/')
                    .then(d => {
                        res.write('<p>Movies of this genre:</p>')
                        for (i in d.data) {
                            if (d.data[i].genres && d.data[i].genres.length > 0) {
                                for (j in d.data[i].genres) {
                                    if (d.data[i].genres[j] === genre) {
                                        res.write('<p>  <a href="/movies/' + d.data[i].id + '">' + d.data[i].title + '</a></p>')
                                    }
                                }
                            }
                        }
                        res.end()
                    })
                    .catch(erro => {
                        res.write('Erro.')
                        res.end()
                    })
            })
            .catch(erro => {
                res.write('Erro')
                res.end()
            })
    }
    else {
        res.write('Erro...')
        res.end()
    }
}).listen(7777)

console.log('Servidor à escuta no port 7777')