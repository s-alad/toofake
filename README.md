# toofake
a bereal viewer
===============
client for bereal.com </br>
want to stalk your friends, family, or ex without posting your own bereal? 
toofake gives the ability to view bereals and post custom bereals without ever having to click on that annoying notification

### work in progress
- commenting still needed
- posting still needed

## how to run locally

* you need the correct python libraries installed (flask, dotenv, geopy and humanfriendly) 
  * in the server directory run:
    - pip install requirements.txt
* If you would like better location accuracy, create a .env file in the server directory and add a google maps api key labeled GAPI='your_key'. Otherwise ignore.
* start flask server on api.py
* npm start in client directory
