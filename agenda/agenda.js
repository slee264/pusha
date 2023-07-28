import Agenda from 'agenda'
import 'dotenv/config'
import { allDefinitions } from './definitions/index.js'
import { schedule } from './scheduler.js'

async function setup_agenda(){
  try{
    console.log("Starting agenda...");
    let agenda = await new Agenda({
    db: { 
      address: process.env["MONGODB_URI_DEV"], 
      collection: "jobs", 
      options: { useUnifiedTopology: true }, 
      },
      processEvery: "1 minute",
      maxConcurrency: 20,
    });
    console.log("Agenda started.");
    return agenda;
  }catch(err){
    console.log(err);
  }
  
}

async function definitions(agenda){
  await allDefinitions(agenda);
  // console.log({ jobs: agenda._definitions })
}

async function scheduleSendMessage(agenda, data){
  console.log("Firing up Agenda to schedule your job...")
  await agenda.start();
  console.log("Agenda fired up.");
  return await schedule.sendMessage(agenda, data);
}

export { setup_agenda, scheduleSendMessage, definitions }
