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
    let ip = rq.ip;

    if (rq.header('X-Forwarded-For')) {
      ip = rq.header('X-Forwarded-For').split(',')[0];
    }

    // only log IPs every few minutes to not spam ipstack
    // TODO: good opportunity for Observable.debounce
    const interval = 5 * 60_000;
    Visit.findOne({
      ip,
      date: {
        $gt: new Date(Math.floor(new Date().getTime() / interval) * interval)
      }
    },
      (err, v) => {
        if (err) {
          console.error(err);
          return;
        }

        // do nothing, we already logged this IP recently
        if (v) {
          return;
        }

        ipstack(ip, ipstackKey, (er: any, ipRs: IpStackResponse) => {
          if (er) {
            console.error(er);
            return;
          }

          new Visit({
            date: new Date(),
            ip: ipRs.ip,
            lat: ipRs.latitude,
            lng: ipRs.longitude
          }).save();
        });
      });

    next();
  });

  app.use(express.static(path.join(__dirname + '/../dist/app-one')));

  app.get('/', (rq: Request, rs: Response) =>
    rs.sendFile(path.join(__dirname + '/../dist/app-one/index.html'))
  );

  app.listen(process.env.PORT || 8080);
}
