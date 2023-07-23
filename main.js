import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
// import schedule from 'node-schedule';
import Busboy from 'busboy';
import moment from 'moment-timezone';
import { DateTime } from 'luxon';

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

app.use(express.static(__dirname))

app.get("/", (req, res) => {
  res.sendFile( __dirname + "/forms/index.html")
})

app.post("/", (req, res) => {
    var busboy = Busboy({ headers: req.headers });
    let valid_credentials = true;
    busboy.on("file", (name, file, info) => {
        file.on("data", async (data) => {
            try{
              const decoder = new TextDecoder('utf-8');
              const data_json = JSON.parse(decoder.decode(data));
              fb_app = await firebase_setup(data_json);
              agenda = await setup_agenda();
              agenda
              .on("ready", async () => {
                console.log(await agenda.jobs())
              })
            }catch(err) {
              if (err.errorInfo.code === 'app/invalid-credential'){
                valid_credentials = false;
              }
            }
        })
    })

    
    busboy.on('finish', function() {
        if (valid_credentials){
            res.redirect("/scheduler");
        }else {
            res.send("Not good, not good.")
        }
    });
    
    req.pipe(busboy);

})

app.get("/scheduler", async (req, res) => {
  // console.log(agenda);
  res.sendFile( __dirname + "/forms/scheduler.html")
})

app.post("/scheduler", urlencodedParser, async (req, res) => {
  await definitions(agenda);
  const { second, minute, hour, date} = req.body;
  const date_time_local = new Date(date);
  const timezone_offset = date_time_local.getTimezoneOffset();
  date_time_local.setHours(hour);
  date_time_local.setMinutes(minute);
  date_time_local.setSeconds(second);
  await scheduleJob(agenda, {"title": "test title", "body": "test body", "time": date_time_local, "device_token": "eRCZR9c5w5n69pl5mSUwTL:APA91bFkZVs6ZXCUchonXYJ6LQIkpjg2tHqZhJij-1rO_rQLdHlR5NErXZErlqjhjZceAZxiuD2bDo9viV7nZHxDcRx7tYi7efQ3W_nHe_j8OB57cyhEvNp44TVLFqIZJqJo-hsJn-Js"})
  console.log(await agenda.jobs())
  res.send(req.body);
})

app.listen(3000, () => {
    console.log("Application listening on port 3000")
})
