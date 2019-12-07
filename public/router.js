var express = require('express');
const router = express.Router();
//const mysql = require('mysql');

router.get('/', function(req, res, next){
    res.render('../public/home')
})

module.exports = router;