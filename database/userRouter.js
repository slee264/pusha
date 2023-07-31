import express from 'express';
import bodyParser from 'body-parser';

import { connect_mongoose, create_event, create_user, get_user } from './index.js';

const userRouter = express.Router();
var jsonParser = bodyParser.json();

userRouter.post("/signup", jsonParser, async (req, res) => {
  res.send(await create_user(req.body));
})

userRouter.post("/get_user", jsonParser, async (req, res) => {
  res.send(await get_user(req.body));
})

userRouter.post("update_user", jsonParser, async (req, res) => {
  let result = {success: false};
  try{
    const user = {
      username: req.body.username,
      password: req.body.password
    }
    
    await get_user(user)
    .then(user => {
      if(user.success){
        //update user
      }
    })
  }catch(err){
    console.log(err);
    result.err = err;
  }
  
  res.send(err);
})

export { userRouter }