import express from 'express';
import bodyParser from 'body-parser';
var jsonParser = bodyParser.json();

import { __dirname } from './utils.js';
import { pushRouter } from './push/pushRouter.js';
import { userRouter } from './database/userRouter.js';

import { firebase_setup } from './push/firebase/firebase.js';
import { setup_agenda } from './push/agenda/agenda.js';
import { connect_mongoose, disconnect_mongoose } from './database/index.js';

const app = express();
let fb_app;
let agenda;

(async () => {
  try {
    const env = process.env["NODE_ENV"];
    // fb_app = await firebase_setup(env);
    // agenda = await setup_agenda(env);
    await connect_mongoose(env);
  } catch(err){
    console.log(err)
  }
})()

app.use(express.static(__dirname))

app.use('/push', pushRouter);
app.use('/user', userRouter)

app.get('/health-check', (req, res) => {
  HEALTH_CHECK_ENABLED ? res.send('OK') : res.status(503).send('Server shutting down');
});

const gracefulShutdownHandler = function gracefulShutdownHandler(signal) {
  console.log(`⚠️ Caught ${signal}, gracefully shutting down`);
  HEALTH_CHECK_ENABLED = false;

  setTimeout(async () => {
    console.log('🤞 Shutting down application');
    // stop the server from accepting new connections
    await server.close(async function () {
      await disconnect_mongoose();
      console.log('👋 All requests stopped, shutting down');
      // once the server is not accepting connections, exit
      process.exit();
    });
  }, 0);
};

// The SIGINT signal is sent to a process by its controlling terminal when a user wishes to interrupt the process.
process.on('SIGINT', gracefulShutdownHandler);

// The SIGTERM signal is sent to a process to request its termination.
process.on('SIGTERM', gracefulShutdownHandler);

// app.post("/trigger", jsonParser, async (req, res) => {
//   try{
//     const { user_info, event_name, push_notif_message } = req.body;
//     const result = await connect_mongoose();
//     if (result.connected){
//       await create_event(user_info, event_name, push_notif_message);
//     }
//   }catch(err){
//     console.log(err)
//   }
  
//   res.send("hi")
// })

const server = app.listen(3000, () => {
  console.log("Application listening on port 3000")
})

export {fb_app, agenda}