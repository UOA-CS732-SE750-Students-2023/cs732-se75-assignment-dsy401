# Getting Started with Node JS App

```bash
# navigate to Backend app folder
$ cd server

# install dependencies
$ npm install

# build the Backend app
$ npm run build

# launch the Backend app
$ npm run start
```


#### Issues running `npm start`
if you meet error below
```bash
Error: listen EADDRINUSE: address already in use :::8080
```
Please `npx kill-port 8080` then `npm start` again