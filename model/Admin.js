'use strict'
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Admin = new Schema({
    id: String,
    username: String,
    password: String
})

module.exports = mongoose.model('Admin',Admin)