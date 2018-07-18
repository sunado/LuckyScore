'use strict'
var UserModel = require('../model/User')
var AdminModel = require('../model/Admin')
var bcrypt = require('br')

exports.authenticate = function(req,res,next){
    AdminModel.findOne({
        username:  req.body.username
    }, function(err,admin){
        if(err){
            throw err
        }

        if(!user){
            console.log("Cannot find user")
            res.render('index')
        }else {
            const compare = by

        }

        

    })
}
