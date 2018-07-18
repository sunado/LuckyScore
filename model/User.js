'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema 

var User = new Schema({
    id: String,
    name: String,
    vote: [{
        score: Number,
        date: {type: Date, default: Date.now}
    }]
})

module.exports = mongoose.model('User',User)