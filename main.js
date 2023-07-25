import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import Busboy from 'busboy';

import { __dirname } from './utils.js';
import { firebase_setup } from './firebase/firebase.js';
import { setup_agenda, definitions, scheduleJob } from './agenda/agenda.js'

const app = express();

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

let fb_app;
let agenda;

(async () => {
  try {
    fb_app = await firebase_setup();
    agenda = await setup_agenda();
    if (agenda){
      await definitions(agenda);
    }
  } catch(err){
    if (err.errorInfo.code === 'app/invalid-credential'){
      valid_credentials = false;
    }
    console.log(err)
  }
})()

app.use(express.static(__dirname))

app.get("/", async (req, res) => {
  res.send("Index")
})

app.post("/", jsonParser, async (req, res) => {
  const { date, hour, minute, repeat, repeatInterval, device_token } = req.body;
  const date_time_local = new Date(date);
  const timezone_offset = date_time_local.getTimezoneOffset();
  date_time_local.setHours(hour);
  date_time_local.setMinutes(minute);
  const schedule = {
    repeat: repeat,
    repeatInterval: repeatInterval,
    time: date_time_local
  }
  console.log(schedule)
  const result = await scheduleJob(agenda, {"title": "test title", "body": "test body", "schedule": schedule, device_token})
  res.send(result);
})

app.listen(3000, () => {
  console.log("Application listening on port 3000")
})
