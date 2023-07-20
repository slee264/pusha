import Agenda from 'agenda'
import 'dotenv/config'
import { allDefinitions } from './definitions/index.js'
import { schedule } from './scheduler.js'
// import { mongo_setup } from '../mongodb.js';

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
    await schedule.sendMessage({"title": "title1", "body": "body1", "device_token": 'DDbbPmIC19S6Xc:APA91bFal4eE8jWpZcGQwsGQBcIIsh_8Fg0F7A1k1pINLqHawTJvPYQqVRiWHDUBGWX5b4oj2uoMJFW4AxtFOH4r75xHpbYDkDsgeQEP8xZA7A_erfooyTbsVb0AyPi-2VaBrsn2hcTa'});
  })
  .on("error", () => console.log("Agenda connection error!"));

// // import all definitions
// allDefinitions(agenda)

export { agenda }
