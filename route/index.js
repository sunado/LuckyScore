'use strict';
var express = require('express');
var router = express.Router();

router.get('/', function(req,res,next){
    res.render('index');
});


router.get('/login', function(req,res,next){
    res.render('login');
});

router.get('/forgot-pw', function(req,res,next){
    res.render('forgot-password');
});

module.exports = router;