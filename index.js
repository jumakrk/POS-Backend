const express = require ('express');
// const cors = require ('cors')

const app = express();
// const studentRoute = require ('./Routes/studentRoute')
// const courseRoute = require ('./Routes/courseRoute')
const authRoute = require ('./Routes/authRoute')


require('dotenv').config()
require('./Model/dbConnect')
require('cors')


app.use(express.json()); //express.json is a body passer pass values from the body to the postman
app.use(express.urlencoded({ extended: true })); //this will parse url encoded data 



// app.use('/api', cors(), studentRoute)
// app.use('/api/student', studentRoute)  //using the middleware for routes
// app.use('/api/course', courseRoute)  //using the middleware for routes
app.use('/api/auth', authRoute)  //using the middleware for routes

// //using cors to  allow cross-origin resource sharing
// const corOptions = {origin: 'http://localhost:3000'}
// app.use(cors(corOptions))//to enable cross-origin resource sharing, we use this middleware function in our server file.

app.listen(process.env.port || 4000, function() {
  console.log('Now listening for requests on: http://localhost:4000');
});