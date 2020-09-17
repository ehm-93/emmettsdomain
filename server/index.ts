import { Express, Request, Response } from 'express';
import { Mongoose } from 'mongoose';

const express = require('express');
const path = require('path');
const ipstack = require('ipstack');

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
  server: {
    ssl: true,
    sslValidate: true
  }
})
  .then(initExpress);

function initExpress() {
  const visitSchema = new mongoose.Schema({
    ip: String,
    date: Date,
    lat: Number,
    lng: Number
  });

  const Visit = mongoose.model('Visit', visitSchema);

  app.use(express.static(__dirname + '/../dist/app-one'));
  app.get('/', (rq: Request, rs: Response) => {
    rs.sendFile(path.join(__dirname + '/../dist/app-one/index.html'));
    ipstack(rq.ip, ipstackKey, (err: any, ipRs: IpStackResponse) => {
      if (err) {
        console.log(err);
        return;
      }

      console.log(`Recording new visit from lat: ${ipRs.latitude}, lng: ${ipRs.longitude}`);

      new Visit({
        date: new Date(),
        ip: ipRs.ip,
        lat: ipRs.latitude,
        lng: ipRs.longitude
      }).save();
    });
  });

  console.log(`Starting app...`);

  app.listen(process.env.PORT || 8080);
}
