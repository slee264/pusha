import Agenda from 'agenda'
import 'dotenv/config'
import { allDefinitions } from './definitions/index.js'
import { schedule } from './scheduler.js'
// import { mongo_setup } from '../mongodb.js';

async function setup_agenda(){
  try{
    let agenda = await new Agenda({
    db: { 
      address: process.env["MONGODB_URI_DEV"], 
      collection: "jobs", 
      options: { useUnifiedTopology: true }, 
      },
      processEvery: "1 minute",
      maxConcurrency: 20,
    });
    return agenda;
  }catch(err){
    console.log(err);
  }
  
}

async function definitions(agenda){
  await allDefinitions(agenda);
  console.log({ jobs: agenda._definitions })
}

async function scheduleJob(agenda, data){
  await agenda.start()
  console.log("agenda started before scheduling")
  await schedule.sendMessage(agenda, data);
}

export { setup_agenda, scheduleJob, definitions }
