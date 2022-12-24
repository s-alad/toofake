# toofake: a bereal viewer

client for bereal.com </br>
want to stalk your friends, family, or ex without posting your own bereal? 
toofake gives the ability to view bereals and post custom bereals without ever having to click on that annoying notification

https://toofake.vercel.app/

### work in progress
- commenting feature is still needed
 - currently there is UI to comment but the backend api route needs to be implemented
- posting any image as a beareal has been added but still is buggy! Make sure to upload both images!
 - the location? and public? toggles still don't do anything yet
- there might still be refresh auth token issues
- there are still countless bugs (send them over)

big shoutout to the team at [BeFake](https://github.com/notmarek/BeFake) for exposing many of the api endpoints!

## how to run locally

* you need the correct python libraries installed (flask, dotenv, geopy and humanfriendly) 
  * in the server directory run:
    - pip install -r requirements.txt
* If you would like better location accuracy, create a .env file in the server directory and add a google maps api key labeled GAPI='your_key'. Otherwise ignore.
* start flask server on api.py
* npm start in client directory
