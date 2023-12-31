import Agenda from 'agenda'
import 'dotenv/config'
import moment from "moment-timezone";

import { allDefinitions } from './definitions/index.js'
import { validateTimezone, validateDate, validateInterval, validateJob, streamline, objectID } from '../utils.js';
import { schedule } from './scheduler.js';

let agenda;

async function setup_agenda(environment){
  try{
    console.log("Starting agenda...");
    agenda = await new Agenda({
    db: { 
      address: environment === "development" ? process.env["MONGODB_AGENDA_URI_DEV"] : process.env["MONGODB_AGENDA_URI_PROD"], 
      collection: "jobs", 
      options: { useUnifiedTopology: true }, 
      },
      processEvery: "1 minute",
      maxConcurrency: 20,
    });
    console.log("Agenda started.");
    if(agenda){
      await allDefinitions(agenda);
    }
    return agenda;
  }catch(err){
    console.log(err);
  }
}

function shutdown_agenda(done){
  try{
    if(agenda){
      console.log("Shutting down Agenda...")
      agenda.stop().then(() => {
        console.log("Agenda shut down.")
        done();
        process.exit(0)
      });
    }else{
      done()
    }
  }catch(err){
    console.log(err)
  }
  
  return 
}

async function definitions(agenda){
  await allDefinitions(agenda);
  // console.log({ jobs: agenda._definitions })
}

async function scheduleSendMessage(data){
  let result = {success: false};
  try{
    let { schedule } = await import('./scheduler.js')
    result = await schedule.sendMessage(data);
  }catch(err){
    console.log(err);
    result.err = err.message;
  }
  
  return result;
}

function getAllTimezones(){
  let result = {success: false}
  try{
    result.data = moment.tz.names();
    result.success = true;
  }catch(e){
    console.log(e);
    result.err = e.message;
  }
  return result;
}

function getTimezones(params){
  let result = {success: false};
  try{
    const { region } = params;
    const tz_list = moment.tz.names();
    var resultLst = [];
    if (region){
      for(const tz of tz_list){
        if(tz.toLowerCase().includes(region.toLowerCase())){
          resultLst.push(tz);
        }
      }
    }
    
    result.data = resultLst;
    result.success = true;
  }catch(e){
    console.log(e)
    result.err = e.message;
  }
  
  return result;
}

async function queryJob(req){
  let result = {success: false}
  try{
    const { _id } = req;
    const objID = objectID(_id);
    const jobs = await agenda.jobs({ _id: objID });
    if(jobs[0]){
      result.data = streamline(jobs[0]);
    }else{
      result.data = null;
      result.message = "Oops, seems like your job doesn't exist!";
    }
    result.success = true;
  }catch(e){
    console.log(e);
    result.err = e.message;
  }
  
  return result;
}

async function cancelJob(req){
  let result = {success: false};
  try{
    const { _id } = req;
    const objID = objectID(_id);
    const cancelled = await agenda.cancel({ _id: objID });
    console.log(cancelled)
    if (cancelled > 0){
      result.success = true;
      result._id = _id;
    }
  }catch(e){
    console.log(e)
    result.err = e.message;
  }
  
  return result;
}

async function modifyJob(req){
  let result = {success: false};
  try{
    const { _id, timezone, startDate, hour, minute, repeat, repeatInterval, device_token, message } = req;
    const oldJobObjID = objectID(_id);
    const newJob = validateJob(timezone, startDate, hour, minute, repeat, repeatInterval);

    if (newJob.valid){
      const cancelled = await agenda.cancel({ _id: oldJobObjID });
      result = await schedule.sendMessage(agenda, {message, device_token, schedule: newJob.schedule});
      if(cancelled < 1){
        result.message = "Your job didn't exist so we just created a new one!";
      }
    }else{
      result.err = newJob.reason;
    }
  }catch(e){
    console.log(e);
    result.err = e.message;
  }
  
  return result;
}

export { agenda, setup_agenda, shutdown_agenda, scheduleSendMessage, definitions, getAllTimezones, getTimezones, queryJob, cancelJob, modifyJob }
