const express = require('express')
const path = require('path')
const cors = require('cors')

// connect to the database
require('./db/mongoose')

// import the routes
const permitRouter = require('./routers/permit')

// initiate the app and set the port
const app = express()
const port = process.env.PORT || 3000

// for the static welcome page
const publicPath = path.join(__dirname, '../public')
app.use(express.static(publicPath))


// to avoid CORS policy problems
app.use(cors())


// parse incoming json to an object
app.use(express.json())

// welcome and health
app.get('', (req, res) => {res.render('index')})
app.get('/health', (req, res) => { res.send({health: 'OK'})})

// add the API routers
app.use(permitRouter)


// start the server
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})