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

router.post('/home', function (req, res, next){

    const username = req.body.username;
    const password = req.body.password;
    const first = req.body.first;
    const last = req.body.last;

    const connection = mysql.createConnection({
        host: 'z1ntn1zv0f1qbh8u.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'gvoch3v86kyzmy53',
        password: 'hmrcywyic6i7uni5',
        database: 'sp1hoq0zi7n09fn5'
    });

    connection.connect();

    connection.query(`INSERT INTO user(username, password, firstName, lastName) VALUES (?, ?, ?, ?)`,[username, password, first, last]
    , (error, results, fields) => {
        if (error) throw error;

        
        res.json({
            message: 'Account created!'
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
        SELECT m.id, m.user_id_home AS User1_name, t1.teamname AS Team1_name, m.user_id_away AS User2_name, t2.teamname AS Team2_name, m.Round_number, m.Winning_user_id, t3.teamname AS Winner
        FROM matches m
        INNER JOIN (
        SELECT u.id, u.team_id, t.teamname
        FROM user u
        INNER JOIN team t on t.id = u.team_id
        ) t1 on t1.id = m.user_id_home
        INNER JOIN (
        SELECT u.id, u.team_id, t.teamname
        FROM user u
        INNER JOIN team t on t.id = u.team_id
        ) t2 on t2.id = m.user_id_away
        INNER JOIN (
        SELECT u.id, u.team_id, t.teamname
        FROM user u
        INNER JOIN team t on t.id = u.team_id
        ) t3 on t3.id = m.winning_user_id
        WHERE m.Round_number = 1 AND Tournament_id = ${id};
        SELECT m.id, m.user_id_home AS User1_name, t1.teamname AS Team1_name, m.user_id_away AS User2_name, t2.teamname AS Team2_name, m.Round_number, m.Winning_user_id, t3.teamname AS Winner
        FROM matches m
        INNER JOIN (
        SELECT u.id, u.team_id, t.teamname
        FROM user u
        INNER JOIN team t on t.id = u.team_id
        ) t1 on t1.id = m.user_id_home
        INNER JOIN (
        SELECT u.id, u.team_id, t.teamname
        FROM user u
        INNER JOIN team t on t.id = u.team_id
        ) t2 on t2.id = m.user_id_away
        INNER JOIN (
        SELECT u.id, u.team_id, t.teamname
        FROM user u
        INNER JOIN team t on t.id = u.team_id
        ) t3 on t3.id = m.winning_user_id
        WHERE m.Round_number = 2 AND Tournament_id = ${id};
    `;
        const connection = mysql.createConnection({
            host: 'z1ntn1zv0f1qbh8u.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
            user: 'gvoch3v86kyzmy53',
            password: 'hmrcywyic6i7uni5',
            database: 'sp1hoq0zi7n09fn5',
            multipleStatements: true
        });
    
        connection.connect();
    
        connection.query(sql, (error, results, fields) => {
            if (error) throw error;
    
            res.render('../public/view', {
                tournaments: results[0],
                round1: results[1],
                round2: results[2]
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

    let username = req.body.username;
    let password = req.body.password;

    if (username){

        const sql = `
            SELECT *
            FROM admin
            WHERE admin.username = '${username}' && admin.password = '${password}'
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
            
            console.log("results:", results)

            if (results != ''){
                successful = true;
                req.session.username = results.username;
            }
            else{
                delete req.session.username;
                message = 'Wrong username or password!'
            }

            res.json({
                successful: successful,
                message: message
            });
            
        });
    
        connection.end();

    }
    else{

        // delete the user as punishment!
        delete req.session.username;
        message = 'Wrong username or password!'
    
        res.json({
            successful: successful,
            message: message
        });

    }
    
    
    
})

router.get('/join', function(req, res, next){

    const id = req.query.id

    if(id){
        const sql = `
        SELECT *
        FROM tournament 
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
            
            console.log("results:", results)

            res.render('../public/join',{
                title: 'Join Tournament',
                data: results
            })
            
            
        });
    
        connection.end();

    }
    
})

router.post('/join', function(req, res, next){
    
    const username = req.body.username;
    const password = req.body.password;
    const id = req.body.id;
    let successful = false;

    
    const connection = mysql.createConnection({
        host: 'z1ntn1zv0f1qbh8u.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'gvoch3v86kyzmy53',
        password: 'hmrcywyic6i7uni5',
        database: 'sp1hoq0zi7n09fn5'
    });

    connection.connect();

    connection.query(
        'UPDATE user SET tournament_id = ? WHERE username = ? && password = ?', [id, username, password]
    , (error, results, fields) => {
        if (error) throw error;
        

        res.json({
            successful: true
        })
        
        
    });

    connection.end();
})

module.exports = router;