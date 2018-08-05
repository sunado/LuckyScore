const express = require('express')

const UserModel = require('../model/User')
const AdminModel = require('../model/Admin')
const VoteList = require('../model/VoteList')
const jwt = require('jsonwebtoken')
const config = require('../config')

exports.filter = function (req, res, next) {
    if (req.url == '/login' || req.url == '/vote' || req.url == '/dhdcfklliljv3470dj' || req.url == '/toilatoikhongthichdaunhe') {
        next();
    } else {
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (req.cookies) {
            //console.log(req.cookies)
            token = req.cookies.token || token
        }
        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, req.app.settings.superSecret, function (err, decoded) {
                if (err) {
                    return res.redirect('login');
                } else {
                    // if everything is good, save to request for use in other routes
                    //console.log("Token valid");
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            // if there is no token
            // return an error
            return res.redirect('login');

        }
    }
};

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

exports.logout = function(req,res,next) {
    res.clearCookie('token');
    res.redirect('login')
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
    var query = VoteList.find().limit(1).sort({$natural:-1})

    query.exec( (err,votes) => {
        if (err) {
            res.render('404')
        } else if(votes.length == 0 || votes[0].status == "stop"){
            res.render('404') 
        } else {
            UserModel.find().exec( (err,users) => {
                if (err) {
                    res.render('vote',{error: 'Cannot read database'})
                }
        
                res.render('vote',{users: users,title: "Bình Chọn " + votes[0].name})
            })
        }
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
                var query = VoteList.find().limit(1).sort({$natural:-1})
                query.exec( (err,votes) => {
                    if(err || votes.length == 0) {
                        res.send({error: "Cannot read database"})
                    } else {
                        user.votes.push({
                            name: votes[0].id,
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
    var query = VoteList.find().limit(1).sort({$natural:-1})
    query.exec( (err,vote_now) => {
        if(err){
            //console.log(err)
            res.render('admin/blank',{message: err})
        } else if(vote_now.length == 0){
            res.render('admin/blank',{message: "Nodata"})
        } else {
            UserModel.find({votes: {$elemMatch: {name: vote_now[0].id}}}).exec ( (err,result) => {
                if(err){
                    res.render('admin/blank',{message: "Database error"})
                } else {
                    var user_votes = []
                    result.forEach(element => {
                        const vote = element.votes[element.votes.length-1]
                        const user_vote = {
                            id: element.id,
                            TC1: vote.TC1,
                            TC2: vote.TC2,
                            TC3: vote.TC3,
                            TC4: vote.TC4
                        }
                        user_votes.push(user_vote)
                    })
                    
                    res.render('admin/dashboard',{title: vote_now[0].name, users: user_votes})
                }
            })
        }

    })
}

exports.adminGetVoteData = function(req,res,next) {
    var query = VoteList.find().limit(1).sort({$natural:-1})
    query.exec( (err,vote_now) => {
        if(err || vote_now.length == 0) {
            console.log(err)
            res.json({})
        } else {
            UserModel.find({votes: {$elemMatch: {name: vote_now[0].id}}}).exec ( (err,result) => {
                if(err) {
                    console.log(err)
                    res.json({})
                } else {
                    var vote_data = {}
                    vote_data.TC1 = [0,0,0,0]
                    vote_data.TC2 = [0,0,0,0]
                    vote_data.TC3 = [0,0,0,0]
                    vote_data.TC4 = [0,0,0,0]

                    result.forEach(element => {
                        //console.log(element)
                        const vote= element.votes[element.votes.length - 1]
                        vote_data.TC1[vote.TC1-1] +=1
                        vote_data.TC2[vote.TC2-1] +=1
                        vote_data.TC3[vote.TC3-1] +=1
                        vote_data.TC4[vote.TC3-1] +=1
                    });

                    res.json(vote_data)
                }
            })
        }
    })
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

exports.demo =  async(req, res, next) => {
    try {
        let votes = await VoteList.find().limit(1).sort({$natural:-1});
    } catch(error) {
        
    }

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