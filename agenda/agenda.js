import Agenda from 'agenda'
import 'dotenv/config'
import { allDefinitions } from './definitions/index.js'
import { schedule } from './scheduler.js'

let agenda;


//setup and connect
try{
  agenda = new Agenda({
  db: { 
    address: process.env["MONGODB_URI_DEV"], 
    collection: "jobs", 
    options: { useUnifiedTopology: true }, 
    },
    processEvery: "1 minute",
    maxConcurrency: 20,
  });
}catch(err){
  console.log(err);
}


agenda
  .on("ready", async () => {
    await agenda.start();
    console.log("Agenda started!");
    await allDefinitions(agenda)
    console.log({ jobs: agenda._definitions });
    // await schedule.logHelloWorld
  ();
  })
  .on("error", () => console.log("Agenda connection error!"));

// // import all definitions
// allDefinitions(agenda)

export { agenda }
