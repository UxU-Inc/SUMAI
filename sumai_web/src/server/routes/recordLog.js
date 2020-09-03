const express = require('express');
const mysql = require('mysql');
const requestIp = require('request-ip');
const dbconfig = require('../security/database');

const db = mysql.createPool(dbconfig)
const router = express.Router();

router.post('/recordLog', (req, res) => {
    let id
    try {
        id = req.session.loginInfo.id
    } catch (TypeError) {
        id = ''
    }
    let ip = requestIp.getClientIp(req).split(':')
    ip = ip[ip.length-1]
    db.query(`INSERT INTO summary.action_log (ipv4, id, action) VALUES ('${ip}', '${id}', '${req.body.action}')`, (err, data) => {
        if(!err) {
            return res.json({ success: true });
        } else {
            console.log(err);
            return res.send(err);
        }
    });
})

router.get('/getIP', (req, res) => {
    let ip = requestIp.getClientIp(req).split(':')
    ip = ip[ip.length-1]
    return res.send(ip)
})
module.exports = router;
