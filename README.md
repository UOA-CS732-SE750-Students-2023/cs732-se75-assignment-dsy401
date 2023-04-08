## Description
<p>COMPSCI 732 Tech Demo - Live Chat using Socket.IO</p>

## Who am I?
<p>Name: Shunyuan Deng</p>
<p>UPI: sden406</p>
<p>Student ID: 736351972</p>

## Running the app

#### Node Version: 16.14.2

####You need to open two terminals to run both Frontend and Backend applications

####To start Frontend:
```bash
# navigate to Frontend app folder
$ cd client

# install dependencies
$ npm install

# launch the Frontend app
$ npm start
```

####To start Backend:
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

#### Issues running `npm install`
It might be related to the node runtime version which is not compatible to the dependencies.
You could try to use `nvm` to switch the node runtime version [NVM Install Guide](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/)

#### Issues running `npm start`
if you meet error below
```bash
Error: listen EADDRINUSE: address already in use :::8080
```
Please `npx kill-port 8080` then `npm start` again

### More Issues running the apps
If you meet more issues to run the apps, please contact me
- student email: <a>sden406@aucklanduni.ac.nz</a>
- personal email: <a>sden406@aucklanduni.ac.nz</a>

## App Instructions

### How to Sign In
Since the app is real time live chatting app with sign in functionality, we will ask the sign in credential to sign in to the app:
![Screen Shot 2023-04-07 at 12 17 48 PM](https://user-images.githubusercontent.com/40448549/230515900-b740122b-887e-43bc-be37-d2edf1bf0ad8.png)

For the demo purpose, I created four in-built users that can be signed in:
- <a>Shunyuan Deng<a/> (email: <a>sden406@aucklanduni.ac.nz<a/> password: <a>123456<a/>)
- <a>Marker<a/> (email: <a>marker@aucklanduni.ac.nz<a/> password: <a>111111<a/>)
- <a>Reviewer<a/> (email: <a>reviewer@aucklanduni.ac.nz<a/> password: <a>654321<a/>)
- <a>Guest<a/> (email: <a>guest@aucklanduni.ac.nz password: <a>333333<a/>)

You can use one of those users above to sign in to the app.

### How the app works

#### Minor Features:
- Allow user to sign in
- Allow user to sign out

#### Main Features:
- Real time private Chat
- Real time group Chat
- Real time chat with all users
- Ability to see who are online or offline

#### How to test the real time chat?
- Open a Browser to sign in as any users in the user lists above (eg. <a>reviewer@aucklanduni.ac.nz</a>)
- Open an incognito Browser to sign in as any users except the user login above (eg. <a>guest@aucklanduni.ac.nz</a>)
![Screen Shot 2023-04-07 at 12 19 02 PM](https://user-images.githubusercontent.com/40448549/230516006-30a0f727-5850-48a9-a09c-d4f01482c946.png)
Then you could try to send some (All in real time!)

#### Note
 - If you restart the server, all the messages will be gone since I use the in-memory data storage.
 - I also did not implement the notification feature, which means if you are not in the tab but someone sends you a message, you will not be able to get message notification. (You need to go to specific tab to see the messages)
