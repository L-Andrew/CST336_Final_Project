var express = require('express');
const router = express.Router();
const mysql = require('mysql');
const session = require("express-session");

router.get('/', function(req, res, next){
    
    const sql = `
SELECT * FROM tournament;
`;

    const connection = mysql.createConnection({
        host: 'z1ntn1zv0f1qbh8u.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'gvoch3v86kyzmy53',
        password: 'hmrcywyic6i7uni5',
        database: 'sp1hoq0zi7n09fn5'
    });

    connection.connect();

    connection.query(sql, (error, results, fields) => {
        if (error) throw error;

        res.render('../public/home', {
            title: 'Gaming Tournaments',
            tournaments: results
        });
        
    });

    connection.end();
    
    
})


router.get('/view', function(req, res, next){

    const id = req.query.id

    if(id){
        const sql = `
        SELECT *
        FROM tournament 
        LEFT JOIN user on tournament.id = user.tournament_id
        WHERE tournament.id = ${id}
        UNION
        SELECT *
        FROM tournament
        RIGHT JOIN user on tournament.id = user.tournament_id
        WHERE tournament.id = ${id};
    `;
        const connection = mysql.createConnection({
            host: 'z1ntn1zv0f1qbh8u.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
            user: 'gvoch3v86kyzmy53',
            password: 'hmrcywyic6i7uni5',
            database: 'sp1hoq0zi7n09fn5'
        });
    
        connection.connect();
    
        connection.query(sql, (error, results, fields) => {
            if (error) throw error;
    
            res.render('../public/view', {
                title: results[0].tname,
                status: results[0].status,
                capacity: results[0].capacity,
                enrolled: results[0].playercount,
                tournaments: results
            });
            
        });
    
        connection.end();

    }
    

    
    
})

router.get('/login', function(req, res, next){
    res.render('../public/login',{
        title: 'Login'
    })
})

router.post('/login', function(req, res, next){
    let successful = false;
    let message = '';

    // TODO: replace with MySQL SELECT and hashing/salting...
    if (req.body.username === 'hello' && req.body.password === 'world') {
        successful = true;
        req.session.username = req.body.username;
        // req.cookie('jason', 'the great!', { maxAge: 900000, httpOnly: true });
    }
    else {
        // delete the user as punishment!
        delete req.session.username;
        message = 'Wrong username or password!'
    }

    console.log('session username', req.session.username);

    // console.log('res.body', req.body);

    // Return success or failure
    res.json({
        successful: successful,
        message: message
    });

})

module.exports = router;