'use strict'
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var VoteList = new Schema({
    id: String,
    name: String,
    status: String,
    startDate: Date,
    dueDate: Date
})

module.exports = mongoose.model('VoteList',VoteList)