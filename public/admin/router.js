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
            title: 'Quote Manager List',
            quotes: results
        });
    });

    connection.end();

});

router.get('/edit', function(req, res, next) {

    const id = req.query.id;

    if (id) {
        // TODO: Lookup the data and provide results to the view 
        // to show an existing quote

        const sql = `
        SELECT * FROM tournament WHERE id=?;
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

                res.render('../public/admin/edit', {
                    title: 'Edit Quote',
                    data: results[0] // get first element of results 
                });
            });

        connection.end();

    }
    else {
        res.render('../public/admin/edit', {
            title: 'Add Quote',
            data: {}
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

    if (req.body.edit) {
        connection.query(
            'UPDATE tournament SET id = ?, tname = ?, capacity = ? WHERE id = ?', [req.body.id, req.body.tname, req.body.capacity, req.body.id], // assuming POST
            (error, results, fields) => {
                if (error) throw error;
                res.json({
                    id: results.id
                });
            });
    }
    else {
        connection.query(
            'INSERT INTO tournament(id, tname, capacity) VALUES (?, ?, ?)', [req.body.id, req.body.tname, req.body.capacity], // assuming POST
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
    // TODO: Lookup the data and provide results to the view 
    // to show an existing quote

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
    
    // TODO: check if there are dependent records...i.e. favorites
    // If there are, error

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

router.get('/result', function(req, res, next) {

    const connection = mysql.createConnection({
        host: 'z1ntn1zv0f1qbh8u.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'gvoch3v86kyzmy53',
        password: 'hmrcywyic6i7uni5',
        database: 'sp1hoq0zi7n09fn5'
    });

    connection.connect();
    
    res.render('../public/admin/result');

    connection.end();

});

module.exports = router;