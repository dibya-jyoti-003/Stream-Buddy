Initialise The project : (terminal)

1. npm init -y
2. npm i mongoose express nodemon
3. connect to MongoDB
4. npm i dotenv
5. create the models (schema)

Changes in files :

1. package.json :
   a. to enable 'import' not 'require' -> 'type' :'module'
   b. for 'npm start' command : "start": "nodemon index.js"

2. index.js :
   a. import express and listen it on a port no.
   b. Connect to MongoDB
