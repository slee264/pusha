import path from 'path';
import {fileURLToPath} from 'url';
import moment from "moment-timezone";

export const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);

function validateTimezone(moment, timezone){
  if(!moment.tz.zone(timezone)){
    return {valid: false, reason: "Invalid timezone. To get a complete list of timezones, \"https://fbtest-uocfw.run.goorm.site/timezones\""}
  }
  
  return {valid: true}
}

function validateDate(date, hour, minute){

  if (!date || date.toString() === "Invalid Date"){
    return {valid: false, reason: "Invalid date"};
    
  }else if (!hour || hour < 0 || hour > 23){
    return {valid: false, reason: "Invalid hour"};
    
  }else if (!minute || minute < 0 || minute > 59){
    return {valid: false, reason: "Invalid minute"};
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
  
  
  return {valid: false, reason: "Invalid interval"}
}

export { validateTimezone, validateDate, validateInterval }