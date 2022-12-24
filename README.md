# toofake: a bereal viewer

### a client for bereal.com! </br></br> want to stalk your friends, family, or ex without posting your own bereal? </br> toofake gives the ability to view bereals and post custom bereals without ever having to click on that annoying notification

https://toofake.vercel.app/

## work in progress
- commenting does not refresh the comments; you have to manually refresh
- posting any image as a beareal has been added but still is buggy! Make sure to upload both images!
 - the location? and public? toggles still don't do anything yet
- there might still be refresh auth token issues
- still need better mobile resize support
- there are still countless bugs (send them over)

## how to run locally

* you need the correct python libraries installed (flask, dotenv, geopy and humanfriendly) 
  * in the server directory run:
    - pip install -r requirements.txt
* if you would like better location accuracy, create a .env file in the server directory and add a google maps api key labeled GAPI='your_key'. Otherwise ignore.
* start flask server on api.py
* npm start in client directory

---

> ### big shoutout to the team at [BeFake](https://github.com/notmarek/BeFake) for exposing many of the api endpoints!
