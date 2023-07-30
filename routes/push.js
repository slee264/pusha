import express from 'express';
import bodyParser from 'body-parser';
import moment from "moment-timezone";

import { validateTimezone, validateDate, validateInterval, validateJob, formalize } from '../utils.js';
import { firebase_setup } from '../firebase/firebase.js';
import { setup_agenda, definitions, scheduleSendMessage } from '../agenda/agenda.js'
import { objectID } from '../database/mongodb.js';

const pushRouter = express.Router();

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

pushRouter.get("/", async (req, res) => {
  res.send("What's up?")
})

// Schedule a job
pushRouter.post("/", jsonParser, async (req, res) => {
  const { timezone, startDate, hour, minute, repeat, repeatInterval, device_token, message } = req.body;
  
  const job = validateJob(timezone, startDate, hour, minute, repeat, repeatInterval);
  
  let result;
  if (job.valid){
    result = await scheduleSendMessage(agenda, {message, device_token, schedule: job.schedule })
  }else{
    result = job.reason;
  }
  
  res.send(result);
  // res.send("hi")
})

//Get all timezones
pushRouter.get("/timezones", jsonParser, async (req, res) => {
  res.send(moment.tz.names());
})

//Query list of timezones
pushRouter.get("/timezones/:region", jsonParser, async (req, res) => {
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

// Query your job using its _id
// Useful for modifying your job
pushRouter.post("/queryJob", jsonParser, async (req, res) => {
  try{
    const { _id } = req.body;
    const objID = objectID(_id);
    const jobs = await agenda.jobs({ _id: objID });
    if(jobs[0]){
      res.send(formalize(jobs[0]));
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
pushRouter.post("/cancelJob", jsonParser, async (req, res) => {
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

pushRouter.post("/modifyJob", jsonParser, async(req, res) =>{
  const { _id, timezone, startDate, hour, minute, repeat, repeatInterval, device_token, message } = req.body;
  console.log(req.body);
  const oldJobObjID = objectID(_id);
  const newJob = validateJob(timezone, startDate, hour, minute, repeat, repeatInterval);

  let result;
  if (newJob.valid){
    await agenda.cancel({ _id: oldJobObjID });
    result = await scheduleSendMessage(agenda, {message, device_token, schedule: newJob.schedule })
  }else{
    result = newJob.reason;
  }
  
  res.send(result);
  // res.send("hi")
})

export { pushRouter }