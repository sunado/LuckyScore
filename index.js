const express = require('express')
const app = express()
const mongoose = require('mongoose')
const config = require('./config')
const path = require('path')
const route = require('./route/index')

mongoose.connect(config.DATABASE,{
    socketTimeoutMS: 0,
    keepAlive: true,
    reconnectTries: 30,
    useNewUrlParser: true
})

app.set('views',path.join(__dirname,'view'))

app.set('view engine','hbs')

app.use(express.static(path.join(__dirname,'public')))

app.use('/',route)

app.listen(8080, () => console.log("App run on port 8080"))

