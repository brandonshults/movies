import express from 'express';
import path from 'path';
import dataSource from './quick-data-source.js';
import bodyParser from 'body-parser';

const server = express(),
  dirtyDataSource = new dataSource(),
  urlEncodedParser = bodyParser.urlencoded({extended: true}),
  jsonParser = bodyParser.json({ type: 'application/*+json' });

server.use('/static', express.static(path.resolve('./static')));
server.get('/', (req, res, next) => res.sendFile(path.resolve('./static/index.html')));

server.get('/my-movies', (req, res, next) => dirtyDataSource.get()
  .then((data) => { res.json(data); next(); })
);

server.post('/my-movies/', urlEncodedParser, (req, res, next) => dirtyDataSource.post(req)
    .then((data) => { res.json(data); next(); })
);

server.delete('/my-movies/:id', (req, res, next) => dirtyDataSource.delete(parseInt(req.params.id, 10))
    .then((data) => { res.json(data); next(); })
);

server.put('/my-movies/:id', urlEncodedParser, (req, res, next) => dirtyDataSource.put(parseInt(req.params.id, 10), req)
    .then((data) => { res.json(data); next(); })
);


server.listen(8080);
console.log('Listening on port 8080');