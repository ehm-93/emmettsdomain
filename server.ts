import { Express, Request, Response } from 'express';

const express = require('express');
const path = require('path');

const app: Express = express();

app.use(express.static(__dirname + '/dist/app-one'));

app.get('/', (rq: Request, rs: Response) => rs.sendFile(path.join(__dirname + '/dist/app-one/index.html')));

app.listen(process.env.PORT || 8080);
