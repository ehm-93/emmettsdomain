import { Express, Request, Response } from 'express';
import { Mongoose } from 'mongoose';

import express = require('express');
import path = require('path');
import ipstack = require('ipstack');

const ipstackKey = process.env.IPSTACK;
const mongoUri = process.env.MONGO;

interface IpStackResponse {
  ip: string;
  latitude: number;
  longitude: number;
}

if (!mongoUri) {
  throw Error('MongoDB connection string is missing.');
}
if (!ipstackKey) {
  throw Error('IP Stack key is missing.');
}

const app: Express = express();

const mongoose = new Mongoose();
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  sslValidate: true
}).then(initExpress);

function initExpress() {
  const visitSchema = new mongoose.Schema({
    ip: String,
    date: Date,
    lat: Number,
    lng: Number
  });

  const Visit = mongoose.model('Visit', visitSchema);

  app.use((rq: Request, rs: Response, next: () => void) => {
    ipstack(rq.header('X-Forwarded-For') || rq.ip, ipstackKey, (err: any, ipRs: IpStackResponse) => {
      if (err) {
        console.error(err);
        return;
      }

      new Visit({
        date: new Date(),
        ip: ipRs.ip,
        lat: ipRs.latitude,
        lng: ipRs.longitude
      }).save();
    });

    next();
  });

  app.use(express.static(path.join(__dirname + '/../dist/app-one')));

  app.get('/', (rq: Request, rs: Response) =>
    rs.sendFile(path.join(__dirname + '/../dist/app-one/index.html'))
  );

  app.listen(process.env.PORT || 8080);
}
