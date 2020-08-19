const express = require('express');
const mysql = require('mysql');
const dbconfig   = require('../security/database');

const db = mysql.createPool(dbconfig)
const router = express.Router();

router.post('/notices', (req, res) => {
    let page=req.body.page
    let rowsPPage=req.body.rowsPPage
    db.query("SELECT * FROM summary.notices ORDER BY `index` DESC LIMIT "+page*rowsPPage+", "+rowsPPage, (err, data) => {
        if(!err) {
            res.send(data);
        } else {
            console.log(err);
            res.send(err);
        }
    })
})

router.get('/noticesCount', (req, res) => {
    db.query("SELECT COUNT(*) FROM summary.notices", (err, data) => {
        if(!err) {
            res.send(data);
        } else {
            console.log(err);
            res.send(err);
        }
    })
})

module.exports = router;