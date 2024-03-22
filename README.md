# TooFake: A BeReal Viewer & Web Client

### Want to keep up with your friends, family, or ex without revealing yourself? </br> TooFake provides the ability to view and download BeReals, and post custom BeReals & Realmojis without ever triggering that annoying notification.

### Visit us at [TooFake](https://toofake.lol)

---

# Current Status: Uncertain - Help Wanted!

BeReal is constantly evolving, potentially disrupting projects like TooFake & BeFake. The open-source community has been instrumental in sustaining this project thus far, and we hope it will continue to do so. Any Pull Requests or contributions are warmly welcomed!

---

# How to Run Locally

**Using Node.js**

- Clone the project: `git clone https://github.com/s-alad/toofake.git`
- Navigate to the /client directory: `cd client`
- Install dependencies: `npm install`
- Start the development server: `npm run dev`

**Using Docker**

- Clone the project: `git clone https://github.com/s-alad/toofake.git`
- Navigate to the /client directory: `cd client`
- Build the Docker image: `docker build . -t toofake`
- Run the Docker container: `docker run -d -p 3000:3000 toofake`

---

# TODO

- [ ] Resolve image format issues (webp, .heic, .heif)
- [ ] Implement comment deletion functionality
- [ ] Integrate instant Realmoji feature
- [ ] Incorporate React-All Realmoji
- [ ] Address display issues with large friends lists
- [ ] Resolve feed fetching problems with large friends lists
- [ ] Fix occasional login 500 errors
- [ ] Refactor state management and login handling
- [ ] Optimize caching and minimize API requests
- [ ] Consider moving certain functionalities to a proxy server
- [ ] Refactor code to eliminate overused state and spaghetti code

---

# Acknowledgments

TooFake owes much to the open-source community and peer projects that have paved the way, including those that have faced legal challenges:

### Special thanks to [rvaidun's BeFake](https://github.com/rvaidun) for its contributions to reverse engineering!

### Kudos to the community at [BeFake](https://github.com/notmarek/BeFake) for uncovering numerous API endpoints!

### Heavily inspired by [Shomil](https://shomil.me/bereal/)

---

Feel free to contribute and help make TooFake even better!
