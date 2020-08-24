const express = require('express');
const mysql = require('mysql');
const dbconfig = require('../security/database');

const db = mysql.createPool(dbconfig)
const router = express.Router();

router.post('/connectLog', (req, res) => {
    db.query(`INSERT INTO summary.connect_log (ipv4, sns_type, id, email, action) VALUES ('${req.body.ipv4}', '${req.body.sns_type}', '${req.body.id}', '${req.body.email}', '${req.body.action}')`, (err, data) => {
        if(!err) {
            return res.json({ success: true });
        } else {
            console.log(err);
            return res.send(err);
        }
    });
})
 
module.exports = router;
