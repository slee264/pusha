import express from 'express';


import { __dirname } from './utils.js';
import { pushRouter } from './routes/push.js';

const app = express();

app.use(express.static(__dirname))

app.use('/push', pushRouter);

app.listen(3000, () => {
  console.log("Application listening on port 3000")
})
