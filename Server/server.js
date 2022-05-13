var servis = require('servis');
var express = require('express');

const{request, response} = require('express');

var server = express();
const port = 3000;

server.use(express.urlencoded({extended: false}));
server.use(express.json());

server.get('/', (request, response) => {
    response.redirect('/Oglasi');
})

server.get('/returnId/:Id', (request, response) =>{
    response.send(servis.returnId(request.params['Id']));
})

server.get('/Oglasi', (request, response) => {
    if (request.query['Kategorija'] != undefined && request.query['valuta'] != undefined && request.query['cenOd'] != undefined && request.query['cenDo'] != undefined)
        response.send(servis.filtriraniOglasi(request.query['Kategorija'], request.query['valuta'], parseInt(request.query['cenOd']), parseInt(request.query['cenDo'])));
    else
        response.send(servis.lista);
})

server.get('/Oglasi/:Id', (request, response) => {
    response.send(servis.returnId(request.params['Id']));
})

server.delete('/deleteOglas/:Id', (request, response) => {
    servis.deleteOglas(request.params['Id']);
    response.end('Oglas obrisan');
})

server.post('/addOglas', (request, response) => {
    servis.addOglas(request.body);
    response.end('Oglas dodat');
})

server.post('/changeOglas', (request, response) => {
    console.log(request.body)
    servis.changeOglas(request.body);
    response.end('Oglas je promenjen');
})
server.get('/filtrirajPoKategoriji', (request, response) => {
    response.send(servis.filtrirajPoKategoriji(request.query["kategorija"]));
})

server.listen(port, () => {console.log('Startovan server')})