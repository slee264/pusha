import express from 'express';
import bodyParser from 'body-parser';
var jsonParser = bodyParser.json();

import { __dirname } from './utils.js';
import { pushRouter } from './push/pushRouter.js';
import { userRouter } from './database/dbRouter.js';
import { connect_mongoose, create_event, create_user, get_user } from './database/index.js';

const app = express();

app.use(express.static(__dirname))

app.use('/push', pushRouter);
app.use('/user', userRouter)

app.post("/trigger", jsonParser, async (req, res) => {
  try{
    const { user_info, event_name, push_notif_message } = req.body;
    const result = await connect_mongoose();
    if (result.connected){
      await create_event(user_info, event_name, push_notif_message);
    }
  }catch(err){
    console.log(err)
  }
  
  res.send("hi")
})

app.listen(3000, () => {
  console.log("Application listening on port 3000")
})