import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
// import schedule from 'node-schedule';
import Busboy from 'busboy';

import { __dirname } from './utils.js';
import { firebase_setup } from './firebase/firebase.js';
import { agenda } from './agenda/agenda.js'

const app = express();

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

let fb_app = firebase_setup();

app.use(express.static(__dirname))

app.get("/", (req, res) => {
  res.sendFile( __dirname + "/forms/index.html")
})

app.post("/", (req, res) => {
    var busboy = Busboy({ headers: req.headers });
    let valid_credentials = true;
    busboy.on("file", (name, file, info) => {
        file.on("data", (data) => {
            try{
                const decoder = new TextDecoder('utf-8');
                const data_json = JSON.parse(decoder.decode(data));
                // fb_app = setup(data_json);
                // agenda
                // .on("ready", async () => {
                //   await agenda.start();
                //   console.log("Agenda started!");
                //   await allDefinitions(agenda)
                //   console.log({ jobs: agenda._definitions });
                //   await schedule.sendMessage({"title": "title1", "body": "body1", "device_token": 'DDbbPmIC19S6Xc:APA91bFal4eE8jWpZcGQwsGQBcIIsh_8Fg0F7A1k1pINLqHawTJvPYQqVRiWHDUBGWX5b4oj2uoMJFW4AxtFOH4r75xHpbYDkDsgeQEP8xZA7A_erfooyTbsVb0AyPi-2VaBrsn2hcTa'});
                // })
                // .on("error", () => console.log("Agenda connection error!"));
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

app.get("/scheduler", (req, res) => {
  
  res.sendFile( __dirname + "/forms/scheduler.html")
})

app.post("/scheduler", urlencodedParser, (req, res) => {
  console.log(req.body);
})

app.listen(4000, () => {
    console.log("Application listening on port 3000")
})

// function main(){
// 	console.log("NODE.JS");
// }

// main();