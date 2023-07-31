import express from 'express';
import bodyParser from 'body-parser';

import { connect_mongoose, create_user, get_user, update_user, create_project, get_project } from './index.js';

const userRouter = express.Router();
var jsonParser = bodyParser.json();

userRouter.post("/signup", jsonParser, async (req, res) => {
  res.send(await create_user(req.body));
})

userRouter.get("/get_user", jsonParser, async (req, res) => {
  res.send(await get_user(req.body)); 
})

userRouter.post("update_user", jsonParser, async (req, res) => {
  res.send(await update_user(req.body));
})

userRouter.post("/project/create", jsonParser, async(req, res) => {
  res.send(await create_project(req.body));
})

userRouter.get("/project/get", jsonParser, async(req, res) => {
  res.send(await get_project(req.body));
})

export { userRouter }