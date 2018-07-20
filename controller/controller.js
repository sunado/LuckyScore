const express = require('express')
const app = express()
var UserModel = require('../model/User')
var AdminModel = require('../model/Admin')
var jwt = require('jsonwebtoken')
var config = require('../config')

exports.authenticate = function(req,res,next) {
    AdminModel.findOne({
        username:  req.body.username
    }, function(err,admin){
        if(err){
            res.render('login',{error: err})
        }

        if(!admin){
            console.log("Cannot find admin")
            res.render('login',{error: "Username not found"})
        }else {
            if (admin.passwd === req.body.passwd) {
                var token = jwt.sign(admin.toJSON(), 'hello i"s me', {
                    expiresIn: 604800 
                })
                
                res.cookie('token', token, { maxAge: 900000, httpOnly: true });
                res.render('index')
            }
        }
    })
}

exports.addUser = function(req,res,next){
    UserModel.findOne({
        id: req.body.id
    }, function(err,user){
        if(err){
            res.render('addUser',{error: err})
        }

        if(user){
            res.render('addUser',{error: "User exist. Please add other user."})
        } else {
            var n = new UserModel({
                id: req.body.id,
                name: req.body.name,
                vote: []
            })

            n.save( (err) => {
                if (err) {
                    res.render('addUser',{error: "Cannot save user. Please try again later. "})
                }

                res.render('addUser',{success: "Success! User added. "})
            })
        }
    })
}

exports.addUser2 = function(req,res,next){
    UserModel.findOne({
        id: req.body.id
    }, function(err,user){
        if(err){
            res.send({error: err})
        }

        if(user){
            res.send({error: "User exist. Please add other user."})
        } else {
            var n = new UserModel({
                id: req.body.id,
                name: req.body.name,
                vote: []
            })

            n.save( (err) => {
                if (err) {
                    res.send({error: "Cannot save user. Please try again later. "})
                }

                UserModel.find().exec( (err,users) => {
                    if (err) {
                        res.send({error: "Cannot read database. Please try again later. "})
                    }
            
                    res.render('admin/users',{users: users})
                })
            })
        }
    })
}

exports.deleteUser = function(req,res,next) {
    //console.log("get Delete signal")
    UserModel.deleteOne({
        id: req.body.id
    }, (err) => {
        //console.log("Action executed")
        if(err){
            res.send(null)
        }
        res.send(true)
    })
}

exports.showAllUser = function(req,res,next) {
    UserModel.find().exec( (err,users) => {
        if (err) {
            res.render('showUser',{error: 'Cannot read database'})
        }

        res.render('showUser',{users: users})
    })
}

exports.showAllUser2 = function(req,res,next) {
    UserModel.find().exec( (err,users) => {
        if (err) {
            res.render('admin/users',{error: 'Cannot read database'})
        }

        res.render('admin/users',{users: users})
    })
}