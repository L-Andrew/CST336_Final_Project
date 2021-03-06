var express = require('express');
const router = express.Router();
const mysql = require('mysql');
const session = require("express-session");

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

    connection.query(sql, (error, results, fields) => {
        if (error) throw error;

        res.render('../public/home', {
            title: 'Gaming Tournaments',
            tournaments: results
        });

    });

    connection.end();


})

router.post('/getReports', function(req, res, next) {

    const username = req.body.username;
    const password = req.body.password;
    const first = req.body.first;
    const last = req.body.last;

    const connection = mysql.createConnection({
        host: 'z1ntn1zv0f1qbh8u.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'gvoch3v86kyzmy53',
        password: 'hmrcywyic6i7uni5',
        database: 'sp1hoq0zi7n09fn5',
        multipleStatements: true
    });

    connection.connect();

    connection.query(`
    SELECT COUNT(*) AS c, teamname FROM (SELECT u.id, u.team_id, t.teamname
    FROM user u
    INNER JOIN team t on t.id = u.team_id) t 
    GROUP BY teamname ORDER BY c DESC;
    SELECT COUNT(*) AS c, CONCAT(u.firstName, " ", u.lastName) AS name, teamname
    FROM matches m
    LEFT JOIN user u on m.winning_user_id = u.id
    INNER JOIN team t on t.id = u.team_id
    WHERE winning_user_id IS NOT NULL
    GROUP BY m.winning_user_id ORDER BY c DESC;
    SELECT COUNT(*) AS c, teamname
    FROM matches m
    LEFT JOIN user u on m.winning_user_id = u.id
    INNER JOIN team t on t.id = u.team_id
    WHERE winning_user_id IS NOT NULL
    GROUP BY m.winning_user_id ORDER BY c DESC;
    `, (error, results, fields) => {

        console.log(results[0]);
        if (error) throw error;
        res.json({
            largestTeam: results[0][0],
            userMostWins: results[1][0],
            teamMostWins: results[2][0]
        });
    });


})

router.post('/home', function(req, res, next) {

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

    connection.query(`INSERT INTO user(username, password, firstName, lastName) VALUES (?, ?, ?, ?)`, [username, password, first, last], (error, results, fields) => {
        if (error) throw error;


        res.json({
            message: 'Account created!'
        });

    });

    connection.end();


})


router.get('/view', function(req, res, next) {

    const id = req.query.id

    if (id) {
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

router.get('/login', function(req, res, next) {
    res.render('../public/login', {
        title: 'Admin Login'
    })
})

router.post('/login', function(req, res, next) {
    let successful = false;
    let message = '';

    let username = req.body.username;
    let password = req.body.password;

    if (username) {

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


            if (results != '') {
                successful = true;
                req.session.username = results.username;
            }
            else {
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
    else {

        // delete the user as punishment!
        delete req.session.username;
        message = 'Wrong username or password!'

        res.json({
            successful: successful,
            message: message
        });

    }



})

router.get('/join', function(req, res, next) {

    const id = req.query.id

    if (id) {
        const sql = `
        SELECT *
        FROM tournament 
        WHERE tournament.id = ${id};
        SELECT *
        FROM team;
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


            res.render('../public/join', {
                title: 'Join Tournament',
                data: results[0],
                teams: results[1]
            })


        });

        connection.end();

    }

})

router.post('/join', function(req, res, next) {
    console.log(req.body);

    const username = req.body.username;
    const password = req.body.password;
    const id = req.body.id;
    var playersArray;


    const connection = mysql.createConnection({
        host: 'z1ntn1zv0f1qbh8u.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'gvoch3v86kyzmy53',
        password: 'hmrcywyic6i7uni5',
        database: 'sp1hoq0zi7n09fn5'
    });

    connection.connect();

    if (req.body.newTeam.length == 0) {
        var sql = `UPDATE user SET tournament_id = ${id}, team_id = ${req.body.team_Id} WHERE username = '${username}' && password = '${password}'`
        connection.query(sql, (error, results, fields) => {
            if (error) throw error;

        });
    }
    else {
        var newTeamId;
        var insertSql = `INSERT INTO team(teamname) VALUES ('${req.body.newTeam}')`
        connection.query(insertSql, (error, results, fields) => {
            newTeamId = results.insertId
            if (error) throw error;
            var sql = `UPDATE user SET tournament_id = ${id}, team_id = ${newTeamId} WHERE username = '${username}' && password = '${password}'`
            connection.query(sql, (error, results, fields) => {
                if (error) throw error;

            });
        });
    }

    function get_info(callback) {
        connection.query(
            'SELECT user.id FROM tournament,user WHERE tournament.id=? && tournament.id=user.tournament_id', [id], (error, results, fields) => {
                if (error) throw error;


                return callback(results);
            });

    }

    get_info(function(result) {
        connection.query(

            'UPDATE tournament SET playercount=(SELECT COUNT(*) FROM user WHERE tournament_id = ?) WHERE tournament.id=?', [id, id], (error, results, fields) => {
                if (error) throw error;

            });

        if (result.length == 4) {
            connection.query(

                'UPDATE tournament SET status="Live" WHERE tournament.id=?', [id, id], (error, results, fields) => {
                    if (error) throw error;

                });
            playersArray = result;
            console.log(id);

            function shuffle(array) {
                array.sort(() => Math.random() - 0.5);
            }

            shuffle(playersArray);
            var sql = "";

            for (var i = 0; i < 4; i += 2) {
                sql = `INSERT INTO matches(matchDate, user_id_home, user_id_away,status,tournament_id,round_number) VALUES ( "Time", ${playersArray[i].id}, ${playersArray[i + 1].id}, "Live", ${id}, 1)`;

                connection.query(sql, (error, results, fields) => {
                    console.log(sql)
                    if (error) {
                        console.log(error);
                    }

                });

            }

        }


    });

    res.json({
        successful: true
    });


})


router.post('/search', function(req, res, next) {
    if (req.body.keyword.length || req.body.statusFilter.length) {

        const connection = mysql.createConnection({
            host: 'z1ntn1zv0f1qbh8u.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
            user: 'gvoch3v86kyzmy53',
            password: 'hmrcywyic6i7uni5',
            database: 'sp1hoq0zi7n09fn5'
        });

        var where = "";
        var k1 = "";
        var k2 = "";
        var s1 = "";
        var s2 = "";

        if (req.body.keyword.length) {
            where = "WHERE"
            var k = `tname LIKE "%${req.body.keyword}%" OR firstName LIKE "%${req.body.keyword}%" OR lastName LIKE "%${req.body.keyword}%"`
            k1 = `(tname LIKE "%${req.body.keyword}%" OR firstName LIKE "%${req.body.keyword}%" OR lastName LIKE "%${req.body.keyword}%" OR t.teamname LIKE "%${req.body.keyword}%")`
            k2 = `tname LIKE "%${req.body.keyword}%"`
        }

        if (req.body.statusFilter.length) {
            s2 += "AND ";
            if (where.length) {
                s1 += "AND "
            }
            where = "WHERE"
            s1 += "status LIKE '" + req.body.statusFilter + "'";
            s2 += "status LIKE '" + req.body.statusFilter + "'";
        }

        var sql = `
    SELECT tournament.id, tname, capacity, status, playercount
    FROM tournament 
    INNER JOIN user on tournament.id = user.tournament_id
    INNER JOIN team t on t.id = user.team_id
    ${where} ${k1} ${s1}
    UNION
    SELECT tournament.id, tname, capacity, status, playercount
    FROM tournament 
    WHERE ${k2} ${s2}
    `;
        console.log(sql)

        if (sql.length) {
            connection.connect();

            connection.query(sql, (error, results, fields) => {
                if (error) throw error;
                console.log(results)
                res.json({
                    results: results,
                });

            });

            connection.end();
        }
    }
});


module.exports = router;
