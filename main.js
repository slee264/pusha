import express from 'express';
import bodyParser from 'body-parser';
var jsonParser = bodyParser.json();

import { __dirname } from './utils.js';
import { pushRouter } from './routes/push.js';
import { connect_mongoose, create_event, create_user } from './database/index.js';

const app = express();

app.use(express.static(__dirname))

app.use('/push', pushRouter);

app.post("/signup", jsonParser, async (req, res) => {
  let result = {success: false};
  try{
    await connect_mongoose();
    const {username, password, profile} = req.body;
    const new_user = {
      username,
      password,
      profile
    }
    const user = await create_user(new_user);
    
    if(user.success){
      result.success = true;
      result.data = user;
    }else{
      result.err = user.err;
    }
  }catch(err){
    console.log(err);
    result.err = err;
  }
  
  res.send(result);
})

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