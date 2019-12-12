var express = require('express');
const app = express();
const router = express.Router();
const mysql = require('mysql');

router.get('/', function(req, res, next) {

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

        res.render('../public/admin/index', {
            title: 'Tournament List',
            data: results
        });
    });

    connection.end();

});

router.get('/logout', function(req, res, next) {
    console.log("logging out")

    if (req.session && req.session.username && req.session.username.length) {
        delete req.session.username;
    }

    res.json({
        successful: true,
        message: ''
    });

});

router.get('/edit', function(req, res, next) {

    const id = req.query.id;

    if (id) {

        const sql = `
        SELECT * FROM tournament WHERE id=?;
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
        WHERE m.Round_number = 1 AND Tournament_id = ${id}
        UNION
        SELECT m.id, m.user_id_home AS User1_name, t1.teamname AS Team1_name, m.user_id_away AS User2_name, t2.teamname AS Team2_name, m.Round_number, m.Winning_user_id, NULL AS Winner
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
        WHERE m.Round_number = 1 AND Tournament_id = ${id} AND m.winning_user_id IS NULL;
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
        WHERE m.Round_number = 2 AND Tournament_id = ${id}
        UNION
        SELECT m.id, m.user_id_home AS User1_name, t1.teamname AS Team1_name, m.user_id_away AS User2_name, t2.teamname AS Team2_name, m.Round_number, m.Winning_user_id, NULL AS Winner
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
        WHERE m.Round_number = 2 AND Tournament_id = ${id} AND m.winning_user_id IS NULL;
        `;

        const connection = mysql.createConnection({
            host: 'z1ntn1zv0f1qbh8u.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
            user: 'gvoch3v86kyzmy53',
            password: 'hmrcywyic6i7uni5',
            database: 'sp1hoq0zi7n09fn5',
            multipleStatements: true
        });

        connection.connect();

        connection.query(sql, [id],
            (error, results, fields) => {
                if (error) throw error;

                res.render('../public/admin/edit', {
                    title: 'Edit Tournament',
                    data: results[0], // get first element of results 
                    round1: results[1],
                    round2: results[2]
                });
            });

        connection.end();
    }
    else {
        res.render('../public/admin/edit', {
            title: 'Add Tournament'
        });
    }

});

router.post('/edit', function(req, res, next) {

    const connection = mysql.createConnection({
        host: 'z1ntn1zv0f1qbh8u.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'gvoch3v86kyzmy53',
        password: 'hmrcywyic6i7uni5',
        database: 'sp1hoq0zi7n09fn5'
    });

    connection.connect();

    if (req.body.id) {
        connection.query(
            'UPDATE tournament SET id = ?, tname = ?, capacity = ?, status=? WHERE id = ?', [req.body.id, req.body.tname, req.body.capacity, req.body.status, req.body.id], // assuming POST
            (error, results, fields) => {
                if (error) throw error;
                res.json({
                    id: results.id
                });
            });
    }
    else {
        connection.query(
            'INSERT INTO tournament(id, tname, capacity,playercount,status) VALUES (?, ?, ?, ?, ?)', [req.body.id, req.body.tname, req.body.capacity, req.body.playercount, req.body.status], // assuming POST
            (error, results, fields) => {
                if (error) throw error;
                res.json({
                    id: results.insertId
                });
            });
    }

    connection.end();

});

router.get('/delete', function(req, res, next) {

    const id = req.query.id;

    if (!id || id.length === 0) {
        return next(new Error('nothing to delete'));
    }

    const sql = `
SELECT * FROM tournament WHERE id = ?;
`;

    const connection = mysql.createConnection({
        host: 'z1ntn1zv0f1qbh8u.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'gvoch3v86kyzmy53',
        password: 'hmrcywyic6i7uni5',
        database: 'sp1hoq0zi7n09fn5'
    });

    connection.connect();

    connection.query(sql, [id],
        (error, results, fields) => {
            if (error) throw error;

            res.render('../public/admin/delete', {
                title: 'Confirm Delete',
                data: results[0] // get first element of results 
            });
        });

    connection.end();

});

router.delete('/delete', function(req, res, next) {

    if (!req.body.id || req.body.id.length === 0) {
        return next(new Error('nothing to delete'));
    }

    const connection = mysql.createConnection({
        host: 'z1ntn1zv0f1qbh8u.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'gvoch3v86kyzmy53',
        password: 'hmrcywyic6i7uni5',
        database: 'sp1hoq0zi7n09fn5'
    });

    connection.connect();

    connection.query(
        'DELETE FROM tournament WHERE id = ?', [req.body.id], // assuming POST
        (error, results, fields) => {
            if (error) throw error;
            res.json({
                id: results.id
            });
        });


    connection.end();

});

router.post('/editResult', function(req, res, next) {

    const connection = mysql.createConnection({
        host: 'z1ntn1zv0f1qbh8u.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'gvoch3v86kyzmy53',
        password: 'hmrcywyic6i7uni5',
        database: 'sp1hoq0zi7n09fn5',
        multipleStatements: true
    });
    var sql = '';
    if (!req.body.wId.length && req.body.bWinner.length && req.body.aWinner.length) {
        var sql = `INSERT INTO matches(user_id_home, user_id_away, tournament_id, round_number) VALUES (${req.body.aWinner}, ${req.body.bWinner}, ${req.body.tournament_id}, 2);`
    }
    if (req.body.wId.length && req.body.Winner.length) {
        sql += `UPDATE matches SET winning_user_id = ${req.body.Winner} WHERE id = ${req.body.wId};`
    }
    if (req.body.aId.length && req.body.aWinner.length) {
        sql += `UPDATE matches SET winning_user_id = ${req.body.aWinner} WHERE id = ${req.body.aId};`
    }
    if (req.body.bId.length && req.body.bWinner.length) {
        sql += `UPDATE matches SET winning_user_id = ${req.body.bWinner} WHERE id = ${req.body.bId};`
    }

    if (sql.length) {
        connection.connect();

        connection.query(sql,
            (error, results, fields) => {
                if (error) throw error;
            });
        connection.end();
    }

});

module.exports = router;
