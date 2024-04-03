# TooFake: a bereal viewer & web client

### want to stalk your friends, family, or ex without posting your own bereal? </br> toofake gives the ability to view & download bereals, and post custom bereals & realmojis without ever having to click on that annoying notification

### https://toofake.lol

---

# current status: IFFY - help wanted!  

BeReal will only continue to change and get more advanced, breaking projects like toofake & befake. The open source community has kept this project going for very long & hopefully can for much longer! Any Pull Requests or changes are always happily welcomed!

---

# how to run locally

**node**  
* clone the project `git clone https://github.com/s-alad/toofake.git` 
* cd into the /client directory `cd client`
* run `npm install`
* run `npm run dev`

**docker**
* dockerhub: https://hub.docker.com/repository/docker/ssalad/toofake/general
* clone the project `git clone https://github.com/s-alad/toofake.git` 
* cd into the /client directory `cd client` 
* run `docker build . -t toofake`
* run `docker run -d -p 3000:3000 toofake`

---


# TODO

- [ ] fix webp, .heic and .heif image issues !!!
- [ ] delete comment ability
- [ ] add instant realmoji
- [ ] react-all realmoji
- [ ] not all friends show for big friends list
- [ ] feed not fetching for big friends list
- [ ] fix occasional login 500 errors
- [ ] change state & login management
- [ ] cache things and use less requests
- [ ] move things to proxy?
- [ ] fix overused state and spaghetti code  

---
# Peers

toofake owes a lot to the open source community & great peer projects that have been cease & desisted:  
### shoutout to [rvaidun's befake](https://github.com/rvaidun) for many parts of the reverse engineering!  
### shoutout to the community at [BeFake](https://github.com/notmarek/BeFake) for exposing many of the api endpoints!
### heavily inspired by [shomil](https://shomil.me/bereal/)
---
