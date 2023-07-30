import express from 'express';
import bodyParser from 'body-parser';

import { connect_mongoose, create_event, create_user, get_user } from './index.js';

const userRouter = express.Router();
var jsonParser = bodyParser.json();

userRouter.post("/signup", jsonParser, async (req, res) => {
  let result = {success: false};
  try{
    await connect_mongoose();
    
    const new_user = {
      username: req.body.username,
      password: req.body.password, 
      profile: req.body.profile
    };

    const user = await create_user(new_user);
    
    result = user;
  }catch(err){
    console.log(err);
    result.err = err;
  }
  
  res.send(result);
})

userRouter.post("/get_user", jsonParser, async (req, res) => {
  let result = {sucess: false};
  try{
    await connect_mongoose();
    const user = { 
      username: req.body.username,
      password: req.body.password,
    };
    
    result = await get_user(user);
  }catch(err){
    console.log(err);
    result.err = err;
  }
  
  res.send(result)
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