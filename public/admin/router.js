var express = require('express');
const app = express();
const router = express.Router();
const mysql = require('mysql');

router.get('/quotes', function(req, res, next) {

    const sql = `
SELECT * FROM matches;
`;

    const connection = mysql.createConnection({
        host: 'z1ntn1zv0f1qbh8u.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'gvoch3v86kyzmy53',
        password: 'hmrcywyic6i7uni5 ',
        database: 'sp1hoq0zi7n09fn5'
    });

    connection.connect();

    connection.query(sql, (error, results, fields) => {
        if (error) throw error;

        res.render('../admin/index', {
            title: 'Quote Manager List',
            quotes: results
        });
    });

    connection.end();

});

router.get('/quotes/edit', function(req, res, next) {

    const id = req.query.id;

    if (id) {
        // TODO: Lookup the data and provide results to the view 
        // to show an existing quote

        const sql = `
        SELECT * FROM matches;
`;

        const connection = mysql.createConnection({
            host: 'z1ntn1zv0f1qbh8u.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
            user: 'gvoch3v86kyzmy53',
            password: 'hmrcywyic6i7uni5 ',
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

router.post('/quotes/edit', function(req, res, next) {

    const connection = mysql.createConnection({
        host: 'z1ntn1zv0f1qbh8u.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'gvoch3v86kyzmy53',
        password: 'hmrcywyic6i7uni5 ',
        database: 'sp1hoq0zi7n09fn5'
    });

    connection.connect();

    if (req.body.quoteId) {
        connection.query(
            'UPDATE l9_quotes SET authorId = ?, quote = ?, category = ? WHERE quoteId = ?', [req.body.authorId, req.body.quote, req.body.category, req.body.quoteId], // assuming POST
            (error, results, fields) => {
                if (error) throw error;
                res.json({
                    id: results.quoteId
                });
            });
    }
    else {
        connection.query(
            'INSERT INTO l9_quotes(authorId, quote, category) VALUES (?, ?, ?)', [req.body.authorId, req.body.quote, req.body.category], // assuming POST
            (error, results, fields) => {
                if (error) throw error;
                res.json({
                    id: results.insertId
                });
            });
    }

    connection.end();

});

router.get('/quotes/delete', function(req, res, next) {

    const id = req.query.id;

    if (!id || id.length === 0) {
        return next(new Error('nothing to delete'));
    }
    // TODO: Lookup the data and provide results to the view 
    // to show an existing quote

    const sql = `
SELECT q.*, CONCAT(a.firstName, ' ', a.lastName) AS fullName 
FROM l9_quotes q INNER JOIN
l9_author a ON q.authorId = a.authorId
WHERE q.quoteId = ?
`;

    const connection = mysql.createConnection({
        host: 'z1ntn1zv0f1qbh8u.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'gvoch3v86kyzmy53',
        password: 'hmrcywyic6i7uni5 ',
        database: 'sp1hoq0zi7n09fn5'
    });

    connection.connect();

    connection.query(sql, [id],
        (error, results, fields) => {
            if (error) throw error;

            res.render('../public/labs/10/delete', {
                title: 'Confirm Delete',
                data: results[0] // get first element of results 
            });
        });

    connection.end();

});

router.delete('/quotes/delete', function(req, res, next) {

    if (!req.body.quoteId || req.body.quoteId.length === 0) {
        return next(new Error('nothing to delete'));
    }
    
    // TODO: check if there are dependent records...i.e. favorites
    // If there are, error

    const connection = mysql.createConnection({
        host: 'z1ntn1zv0f1qbh8u.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'gvoch3v86kyzmy53',
        password: 'hmrcywyic6i7uni5 ',
        database: 'sp1hoq0zi7n09fn5'
    });

    connection.connect();

    connection.query(
        'DELETE FROM l9_quotes WHERE quoteId = ?', [req.body.quoteId], // assuming POST
        (error, results, fields) => {
            if (error) throw error;
            res.json({
                id: results.quoteId
            });
        });


    connection.end();

});

module.exports = router;