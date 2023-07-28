import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import Busboy from 'busboy';
import moment from "moment-timezone";

import { __dirname, validateTimezone, validateDate, validateInterval } from './utils.js';
import { firebase_setup } from './firebase/firebase.js';
import { setup_agenda, definitions, scheduleJob } from './agenda/agenda.js'
import { objectID } from './database/mongodb.js';

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
    console.log(err)
  }
})()

app.use(express.static(__dirname))

app.get("/", async (req, res) => {
  res.send("What's up?")
})

async function createJob(timezone, date, hour, minute, repeat, repeatInterval, device_token, message){
  
  const validTimezone = validateTimezone(moment, timezone);
  if (!validTimezone.valid){
    return validTimezone.reason;
  }
  
  const validDate = validateDate(date, hour, minute);
  
  if (!validDate.valid){
    return validDate.reason;
  }
  
  const validInterval = validateInterval(repeatInterval);
  
  if (!validInterval.valid){
    return validInterval.reason;
  }
  
  const schedule = {
    repeat: (repeat === "true")? repeat : "false",
    repeatInterval: validInterval.interval,
    time: validDate.date,
    timezone: timezone
  }
  
  const result = await scheduleJob(agenda, {message, "schedule": schedule, device_token})
  return result;
}

// Schedule a job
app.post("/", jsonParser, async (req, res) => {
  const { timezone, date, hour, minute, repeat, repeatInterval, device_token, message } = req.body;
  
  const result = await createJob(timezone, date, hour, minute, repeat, repeatInterval, device_token, message);
  res.send(result);
})

//Get all timezones
app.get("/timezones", jsonParser, async (req, res) => {
  res.send(moment.tz.names());
})

//Query list of timezones
app.get("/timezones/:region", jsonParser, async (req, res) => {
  const { region } = req.params;
  const tz_list = moment.tz.names();
  var result = [];
  if (region){
    for(const tz of tz_list){
      if(tz.toLowerCase().includes(region.toLowerCase())){
        result.push(tz);
      }
    }
  }
  res.send(result);
})

// Query your job info using its _id
// Useful for making sure your job was correctly saved
app.post("/queryJobInfo", jsonParser, async (req, res) => {
  try{
    const { _id } = req.body;
    const objID = objectID(_id);
    const jobs = await agenda.jobs({ _id: objID });
    res.send(jobs[0].attrs);
    return;
  }catch(err){
    res.send(err);
    return;
  }
})

// Query your job using its _id
// Useful for modifying your job
app.post("/queryJobObject", jsonParser, async (req, res) => {
  try{
    const { _id } = req.body;
    const objID = objectID(_id);
    const jobs = await agenda.jobs({ _id: objID });
    if(jobs[0]){
      res.send(jobs[0]);
      return;
    }else{
      res.send("Oops, seems like your job doesn't exist!");
      return;
    }
    return;
  }catch(err){
    res.send(err);
    return;
  }
})

//Cancel and remove the job from database.
app.post("/cancelJob", jsonParser, async (req, res) => {
  try{
    const { _id } = req.body;
    const objID = objectID(_id);
    const result = await agenda.cancel({ _id: objID });
    if (result > 0){
      res.send("Successfully removed job from collection");
    }else{
      res.send("Looks like your job with _id doesn't exist in the database. No worries!");
    }
  }catch(err){
    res.send(err);
    return;
  }
})

app.listen(3000, () => {
  console.log("Application listening on port 3000")
})
