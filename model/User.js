'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema 

var User = new Schema({
    id: String,
    name: String,
    votes: [{
        name: String,
        TC1: Number,
        TC2: Number,
        TC3: Number,
        TC4: Number,
        count: Number,
        date: {type: Date, default: Date.now()}
    }]
})

module.exports = mongoose.model('User',User)