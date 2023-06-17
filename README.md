# toofake: a bereal viewer

### a client for bereal.com! </br></br> want to stalk your friends, family, or ex without posting your own bereal? </br> toofake gives the ability to view bereals and post custom bereals without ever having to click on that annoying notification

### https://toofake.vercel.app/

---
## current status:
not working, all the functionality has been broken due to BeReal chaanges. [rvaidun](https://github.com/rvaidun)'s project has been shut down and no longer works aswell. Check out the project at [BeFake](https://github.com/notmarek/BeFake) for a working client!
---

## how to run locally

* you need the correct python libraries installed (flask, dotenv, geopy, pendulum, Pillow, humanfriendly, and some others) 
  * in the server directory run: ```pip install -r requirements.txt```
* if you would like better location accuracy, create a .env file in the server directory and add a google maps api key labeled GAPI='your_key'. Otherwise ignore.
* start flask server on api.py
* npm start in client directory

---

> ### big shoutout to the team at [BeFake](https://github.com/notmarek/BeFake) for exposing many of the api endpoints!
> ### heavily inspired by [shomil](https://shomil.me/bereal/) and [rvaidun](https://github.com/rvaidun) 
