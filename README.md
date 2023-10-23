# Pusha
A platform that facilitates collaborative management, creation, and scheduling of customer push notifications, bridging the gap between programmers and non-programmers

### Create a job: in JSON format,
  #### Whether you want your job to be repeated
  * If repeat !== "true", this will be ignored and default to "false".
  "repeat": "true"/"false"
  
  #### The interval at which you want your job to be repeated
  * If repeat === "true", write your interval in minute/hour/day/week/month/year
  * if repeat !== "true", this will be ignored.
  * Only the first integer encountered that's before a space character in {repeatInterval} will be counted.
  * Likewise for the interval.
  * ex) "1 2 day" will be interpreted as "1 day" and not "12 day"
  
  "repeatInterval": ["1 day"/"2 days"/"3 days"/"1 minute"/"2 minutes"/...]
  
  #### The time at which you want your job to be executed.
  * Your job will be first executed on "startDate" at "hour":"minute" you provide in "timezone".
  * (Look at example below)
  * The complete list of timezones can be found in "https://fbtest-uocfw.run.goorm.site/timezones".
  * (You can try searching for your city. ex) "https://fbtest-uocfw.run.goorm.site/timezones/chicago")
  * (Try searching for your city first. If you don't get any result, try your region. Do not try your country. e.g. "Chicago", "America", "Africa", "Atlantic" ...)
  * Seconds will be ignored. (Every job is executed at hh:mm:00.)
  * SPECIFY HOUR AND MINUTE. EX) IF YOU WANT YOUR JOB EXECUTED AT 11 PM, WRITE "23:00".
  
  "timezone": Your timezone (e.g. "America/New_York", "Asia/Bangkok", ...)\
  "starDate": In String format (e.g. "2023-07-25", "2024-02-20", ...)\
  "hour": In military time ("0" - "23")\
  "minute": ("0" - "59")
  
  
  #### Your message(push notification title and body)
  * This will shortly be improved upon in its detail
  
  "message": {"title": "test title", "body": "test body"}
  
  #### Device token(s) you want your push notification to be sent to
  "device_token": ["asd1ol2h4nk12j4n...", "asd1123vv...", ...]

  POST to "https://fbtest-uocfw.run.goorm.site/" with body including the above data.
  
  Ex) {"repeat": "true", "repeatInterval": "5 minutes", "timezone": "America/New York", date": "2022-07-25", "hour": "12", "minute": "34", ...}
  Will be first executed On July 25th, 2022 at 12:13 in ET and repeated every 5 minute from then on.
  
  * A wrong device token will not result in throwing an error.
  * However, a wrong date format, wrong repeat/repeatInterval, and etc. will generate an HTML response with error information.
  * Keep your response._id(your job ID) for future uses.
  
### Query a job: in JSON format,
  #### Your job id
  "_id": "abcde..."
  
  * You will be provided with an HTML response accordingly. Providing a wrong _id will not thorw an error.

  Ex) {"_id": "abcde..."}
  
  POST to "https://fbtest-uocfw.run.goorm.site/queryJobInfo" with body including the above data.


### Cancel a job: in JSON format,
  #### Your job id
  "_id": "abcde..."
  
  * You will be provided with an HTML response accordingly. Providing a wrong _id will not thorw an error.

  Ex) {"_id": "abcde..."}
  
  POST to "https://fbtest-uocfw.run.goorm.site/cancelJob" with body including the above data.

### Search for your timezone String:
  GET (or enter in an address bar) to "https://fbtest-uocfw.run.goorm.site/timezones/:region" where ":region" is replaced by your city/region. 
  
  Ex) "https://fbtest-uocfw.run.goorm.site/timezones/new_york"
  
  "https://fbtest-uocfw.run.goorm.site/timezones/" will return a complete list of timezones.

### Modifiy your job:
  Currently there is no way to modify an existing job. One way around this is to cancel your existing job and create a new one.\
  To make it as convenient for you as possible, I've streamlined the process to an extent.
  
  Step 1. Query your existing job with _id.\
  Ex) "https://fbtest-uocfw.run.goorm.site/queryJob" with "{"_id": "abcdefg..."}. It will return a result in the same form as the one you used to post a new job.

  Step 2. You modify the result to your liking. Make sure you include your existing job id.\
  Ex) {"_id": "abcdefg...", "timezone": ...}
  
  Step 3. Post to "https://fbtest-uocfw.run.goorm.site/modifyJob". It will delete your existing job and create a new one. It'll return a new job id.
