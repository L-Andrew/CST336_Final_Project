var express = require('express');
const router = express.Router();
const mysql = require('mysql');

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

module.exports = router;