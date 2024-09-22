import connect_DB from './db_connection/db_connection.js'
import dotenv from 'dotenv'
import {app} from './app.js'

dotenv.config()

connect_DB()
.then(() => {
    app.listen (process.env.PORT || 8800, () => { 
    console.log(`Server running succesfully on port no. ${process.env.PORT}`)
    } )
}).catch((error) => {
    console.log('Problem connecting to server')
});

