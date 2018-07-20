'use strict'
var express = require('express')
var router = express.Router()
var controller = require('../controller/controller')

router.get('/', (req,res,next) => res.render('index'))

router.get('/login', (req,res,next) => res.render('login'))

router.get('/forgot-pw', (req,res,next) => res.render('forgot-password'))

router.get('/add', (req,res,next) => res.render('addUser'))

router.get('/show', controller.showAllUser)

router.get('/admin', (req,res,next) => res.render('admin/admin'))

router.get('/admin/users', controller.showAllUser2)

router.post('/login', controller.authenticate)

router.post('/add', controller.addUser)

router.post('/addUser', controller.addUser2)

router.post('/deleteUser', controller.deleteUser)

module.exports = router