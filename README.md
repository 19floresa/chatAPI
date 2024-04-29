# chatAPI

# 0. set up database
* ```mkdir data && cd data && mkdir db && cd ..```

# 1. Import Libraries
To import all the requires libraries you will need to call 'npm i' in the following directories:
* ```./```
* ```./client/```

# 2. RUN db
* ```mongod -dbpath data/db --port 27017```

# 3. Run backend code in './'
* ```node app.js```

# 4. Run frontend code in './client/'
* ```npm run start```
* In a different web browser tab open the same webpage for user2 (i.e http://localhost:3000/)
* If the url does not work then copy and paste the http link from the first tab

# 5. Register a user with the GUI
* In the first Login screen click register in the bottom of the input boxes.
* Then, register with a username and password.
* Finally, register a second user.
* Save both usernames and passwords!
* Example username and password:
* User1: ```19floresa```, password1: ```123```
* User2: ```XXX_cool_user_XXX```, password2: ```123```

# 6. Login with the users created beforehand
* Go back to the login page.
* Enter data of user1 in the first tab.
* Repeat for user2.

# 7. Communicate with user2
* In the web browser tab for user1, find user2.
* Type a message in the bottom of the webpage and send your message to user2.
* Repeat for user2.
* In both tabs, you should see user1 and user2 message.
