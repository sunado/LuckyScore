const express = require('express')

const UserModel = require('../model/User')
const AdminModel = require('../model/Admin')
const VoteList = require('../model/VoteList')
const jwt = require('jsonwebtoken')
const config = require('../config')

exports.authenticate = function(req,res,next) {
    AdminModel.findOne({
        username:  req.body.username
    }, function(err,admin){
        if(err){
            res.render('login',{error: err})
        }

        if(!admin){
            //console.log("Cannot find admin")
            res.render('login',{error: "Username not found"})
        }else {
            if (admin.passwd === req.body.passwd) {
                var token = jwt.sign(admin.toJSON(), req.app.settings.superSecret, {
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

exports.showVoteView = function(req,res,next) {
    UserModel.find().exec( (err,users) => {
        if (err) {
            res.render('vote',{error: 'Cannot read database'})
        }

        res.render('vote',{users: users,title: "Bình Chọn"})
    })
}

exports.onVote = function(req,res,next) {
    console.log(req.body.userid);
    var sc1 = parseInt(req.body.sc1);
    var sc2 = parseInt(req.body.sc2);
    var sc3 = parseInt(req.body.sc3);
    var sc4 = parseInt(req.body.sc4);

    if(!validate(sc1)|| !validate(sc2) || !validate(sc3) || !validate(sc4)) {
        res.send({error: "The data is invalid"})
    } else {
        UserModel.findOne({
            id: req.body.userid
        }, function(err,user){
            if(err){
                res.send({error: err})
            }
    
            if(!user){
                res.send({error: "User not exist. Please choose other user."})
            } else {
                user.votes.push({
                    name: "TODO",
                    TC1: sc1,
                    TC2: sc2,
                    TC3: sc3,
                    TC4: sc4,
                    date: Date.now()
                })

                user.save( (err) => {
                    if(err){
                        res.send({error: err})
                    } else {
                        res.send({success: "done"})
                    }
                });
            }
        })
    }
}

exports.adminUsers = function(req,res,next) {
    UserModel.find().exec( (err,users) => {
        if (err) {
            res.render('admin/users',{error: 'Cannot read database'})
        }

        res.render('admin/users',{users: users})
    })
}

exports.adminDashboard = function(req,res,next){
    res.render('admin/dashboard');
}

exports.adminStatus = function(req,res,next) {   
    var query = VoteList.find().limit(1).sort({$natural:-1})
    query.exec( (err,vote) => {
        if(err){
            console.log(err)
            res.render('admin/status',{onStop: " "})
        } else {
            if(vote.length == 0){
                //console.log("1")
                res.render('admin/status',{onStop: " "})
            } else if( vote[0].status == "run"){
                //console.log("2")
                res.render('admin/status', {onVote: vote[0].name})
            } else {
                //console.log("3")
                res.render('admin/status',{onStop: " "})
            }
        }
    })
    
}

exports.adminUpdateStatus = function(req,res,next) {
    var query = VoteList.find().limit(1).sort({$natural:-1})
    query.exec( (err,votes) => {
        if (err) {
            console.log(err)
            res.render('admin/status', {error: err})
        } else {
            //console.log(votes)
            if(votes.length == 0){
                voteNew = new VoteList({
                    id: 1,
                    status: "run",
                    name: req.body.name,
                    startDate: Date.now(),
                    dueDate: Date.now(),
                })
                voteNew.save( (err) => {
                    if(err) {
                        res.render('admin/status',{error: err})
                    } else {
                        res.render('admin/status',{onVote: req.body.name})
                    }
                })
            } else if(votes[0].status == "stop"){
                voteNew = new VoteList({
                    id: votes[0].id+1,
                    status: "run",
                    name: req.body.name,
                    startDate: Date.now(),
                    dueDate: Date.now(),
                })
                voteNew.save( (err) => {
                    if(err) {
                        res.render('admin/status',{error: err})
                    } else {
                        res.render('admin/status',{onVote: req.body.name})
                    }
                })
            } else {
                votes[0].dueDate = Date.now()
                votes[0].status = "stop"
                votes[0].save( (err) => {
                    if(err) {
                        res.render('admin/status',{error: err})
                    } else {
                        res.render('admin/status',{onStop: " "})
                    }
                })
            }
        }
    })
}

exports.adminCreate = function(req,res,next) {
    AdminModel.findOne({
        id: req.body.username
    }, function(err,user){
        if(err){
            res.render('createadmin',{error: err})
        }

        if(user){
            res.render('createadmin',{error: "User exist. Please add other user."})
        } else {
            var n = new AdminModel({
                username: req.body.username,
                passwd: req.body.passwd
            })

            n.save( (err) => {
                if (err) {
                    res.render('createadmin',{error: "Cannot save user. Please try again later. "})
                }

                res.render('createadmin',{success: "Success! Addmin added. "})
            })
        }
    })
}

function validate(num){
    if(isNaN(num) || num > 4 || num < 1) {
        return false;
    } else {
        return true;
    }
}