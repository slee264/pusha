import express from 'express';
import bodyParser from 'body-parser';
import moment from "moment-timezone";

import { validateTimezone, validateDate, validateInterval, validateJob, formalize } from './utils.js';
import { firebase_setup } from './firebase/firebase.js';
import { setup_agenda, definitions, scheduleSendMessage, getAllTimezones, getTimezones, queryJob, cancelJob, modifyJob } from './agenda/agenda.js'
import { objectID } from '../database/index.js';

const pushRouter = express.Router();

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
// var urlencodedParser = bodyParser.urlencoded({ extended: false });

let fb_app;
let agenda;

(async () => {
  try {
    fb_app = await firebase_setup();
    agenda = await setup_agenda();
  } catch(err){
    console.log(err)
  }
})()

pushRouter.get("/", async (req, res) => {
  res.send("What's up?")
})

// Schedule a job
pushRouter.post("/", jsonParser, async (req, res) => {
  res.send(await scheduleSendMessage(agenda, req.body));
})

//Get all timezones
pushRouter.get("/timezones", jsonParser, async (req, res) => {
  res.send(getAllTimezones());
})

//Query list of timezones
pushRouter.get("/timezones/:region", jsonParser, async (req, res) => {
  res.send(getTimezones(req.params));
})

// Query your job using its _id
// Useful for modifying your job
pushRouter.get("/queryJob", jsonParser, async (req, res) => {
  res.send(await queryJob(agenda, req.body));
})

//Cancel and remove the job from database.
pushRouter.post("/cancelJob", jsonParser, async (req, res) => {
  res.send(await cancelJob(agenda, req.body));
})

pushRouter.post("/modifyJob", jsonParser, async(req, res) =>{
  res.send(await modifyJob(agenda, req.body));
})

export { pushRouter }