import path from 'path';
import {fileURLToPath} from 'url';
import moment from "moment-timezone";

export const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);

function validateTimezone(timezone){
  if(!moment.tz.zone(timezone)){
    return {valid: false, reason: "Invalid timezone. Needs to be in the format of \"Region/City\". For example, \"America/Chicago\". To get a complete list of timezones, \"https://fbtest-uocfw.run.goorm.site/timezones\""}
  }
  
  return {valid: true}
}

function validateDate(date, hour, minute){
  const ymd = date.split("-");
  console.log(ymd)

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

function formalize(job){
  const attrs = job.attrs;
  var formalized_attrs = {
    "_id": attrs._id,
    "timezone": attrs.repeatTimezone, 
    "startDate": attrs.startDate,
    "hour": attrs.repeatAt.split(" ")[1].split(":")[0],
    "minute": attrs.repeatAt.split(" ")[1].split(":")[1],
  }
  
  if(attrs.repeatInterval){
    formalized_attrs.repeat = "true";
    formalized_attrs.repeatInterval = attrs.repeatInterval;
  }
  
  formalized_attrs.message = attrs.data.message;
  formalized_attrs.device_token = attrs.data.device_token;
  
  return formalized_attrs;
}

export { validateTimezone, validateDate, validateInterval, validateJob, formalize }