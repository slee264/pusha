import moment from "moment-timezone";
import { ObjectId } from 'mongodb';

function validateTimezone(timezone){
  if(!moment.tz.zone(timezone)){
    return {valid: false, reason: "Invalid timezone. Needs to be in the format of \"Region/City\". For example, \"America/Chicago\". To get a complete list of timezones, \"https://fbtest-uocfw.run.goorm.site/timezones\""}
  }
  return {valid: true}
}

function validateDate(date, hour, minute){
  const ymd = date.split("-");

  if (!date || ymd[0].length != 4 || ymd[1].length > 2 || ymd[2].length > 2 || (new Date(date)).toString() === "Invalid Date"){
    return {valid: false, reason: "Invalid date. Needs to be in the format of \"yyyy:mm:dd\". Ex) \"2020-02-20\""};
    
  }else if (!hour || hour < 0 || hour > 23){
    return {valid: false, reason: "Invalid hour. Hour needs to be between 0 and 23, inclusive."};
    
  }else if (!minute || minute < 0 || minute > 59){
    return {valid: false, reason: "Invalid minute. Minute needs to be between 0 and 59, inclusive."};
  }
  
  const res_date = new Date(date);
  res_date.setHours(hour);
  res_date.setMinutes(minute);
  return {valid: true, date: res_date}
}

function validateInterval(interval){
  let intervals = ["minute", "hour", "day", "week", "month", "year"];
  for (const iv of intervals){
    if (interval.includes(iv)){
      const words = interval.split(" ");
      if (/\d/.test(words[0])){
        return {valid: true, interval: words[0] + " " + iv}
      }
    }
  }
  
  return {valid: false, reason: "Invalid interval. Needs to be in the format of \":number minute/hour/days/week/month/year\""}
}

function validateJob(timezone, date, hour, minute, repeat, repeatInterval){

  const validTimezone = validateTimezone(timezone);
  if (!validTimezone.valid){
    return validTimezone;
  }
  
  const validDate = validateDate(date, hour, minute);
  
  if (!validDate.valid){
    return validDate;
  }
  
  const validInterval = validateInterval(repeatInterval);
  
  if (!validInterval.valid){
    return validInterval;
  }
  
  const schedule = {
    repeat: (repeat === "true")? repeat : "false",
    repeatInterval: validInterval.interval,
    time: validDate.date,
    timezone: timezone
  }
  
  return {valid: true, schedule};
}

function streamline(job){
  const attrs = job.attrs;
  let streamlined_attrs = {};

  streamlined_attrs._id = attrs._id;
  streamlined_attrs.name = attrs.name;
  streamlined_attrs.message = attrs.data.message;
  streamlined_attrs.device_tokens = attrs.data.device_token;
  streamlined_attrs.timezone = attrs.repeatTimezone;
  
  if(attrs.repeatInterval){
    streamlined_attrs.repeat = "true";
    streamlined_attrs.repeatInterval = attrs.repeatInterval;
    streamlined_attrs.startDate = attrs.startDate;
    streamlined_attrs.repeatAt = attrs.repeatAt;
  }else{
    const date = new Date(attrs.nextRunAt)
    streamlined_attrs.repeat = "false";
    streamlined_attrs.runAt = attrs.nextRunAt.toISOString();
  }
  
  return streamlined_attrs;
}

function objectID(_id){
  try{
    const objID = new ObjectId(_id);
    return objID;
  }catch(err){
    return err;
  }
}

export { validateTimezone, validateDate, validateInterval, validateJob, streamline, objectID }