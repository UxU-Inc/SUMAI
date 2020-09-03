const mysql = require('mysql');
const requestIp = require('request-ip');
const dbconfig = require('../security/database');
const db = mysql.createPool(dbconfig)

function record(req, act) {
    let ip = requestIp.getClientIp(req).split(':')
    let id
    try {
        ip = ip[ip.length-1]
        id = req.session.loginInfo.id
    } catch (TypeError) {
        id = ''
    }
    db.query(`INSERT INTO summary.action_log (ipv4, id, action) VALUES ('${ip}', '${id}', '${act}')`, (err, data) => {
        if(!err) {
        } else {
            console.log(err);
        }
    });
}

module.exports = record;