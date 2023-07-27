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

// Schedule a job
app.post("/", jsonParser, async (req, res) => {
  const { timezone, date, hour, minute, repeat, repeatInterval, device_token, message } = req.body;
  
  const validTimezone = validateTimezone(moment, timezone);
  if (!validTimezone.valid){
    res.send(validTimezone.reason);
    return;
  }
  
  const validDate = validateDate(date, hour, minute);
  
  if (!validDate.valid){
    res.send(validDate.reason);
    return;
  }
  
  const validInterval = validateInterval(repeatInterval);
  
  if (!validInterval.valid){
    res.send(validInterval.reason);
    return;
  }
  
  const schedule = {
    repeat: (repeat === "true")? repeat : "false",
    repeatInterval: validInterval.interval,
    time: validDate.date,
    timezone: timezone
  }
  
  const result = await scheduleJob(agenda, {message, "schedule": schedule, device_token})
  res.send(result);
  return;
  
})

//Query list of timezones
app.get("/timezones", jsonParser, async (req, res) => {
  const { region } = req.body;
  const tz_list = moment.tz.names();
  var result = [];
  if (region){
    for(const tz of tz_list){
      if(tz.includes(region)){
        result.push(tz);
      }
    }
  }else{
    result = tz_list;
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
      res.send("Looks like your job with _id doesn't exist in the database.");
    }
  }catch(err){
    res.send(err);
    return;
  }
})

// Save your modified job.
// app.post("/saveJob", jsonParser, async (req, res) => {
//   try{
//     const modifiedJob = req.body.job;
//     const objID = objectID(modifiedJob._id);
//     var job = (await agenda.jobs({_id: objID}))[0];
//     await agenda.disable({_id: objID});
//     job.attrs = modifiedJob;
//     const result = await job.save();
//     await agenda.enable({_id: objID});
//     res.send(result);
//   }catch(err){
//     console.log(err);
//   }
// })

app.listen(3000, () => {
  console.log("Application listening on port 3000")
})
