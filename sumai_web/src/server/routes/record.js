const express = require('express');
const mysql = require('mysql');
const dbconfig   = require('../security/database');

const db = mysql.createPool(dbconfig)
const router = express.Router();

// 기록 최신순으로 가져오기
router.post('/lastest', (req, res) => {
    if(req.body.idx === -1) req.body.idx = "(SELECT MAX(idx) FROM summary.summary_data)"
    // db.query("SELECT * FROM summary.summary_data WHERE idx <= "+ req.body.idx +" ORDER BY idx DESC LIMIT 10;", (err, data) => {
    //     if(!err) {
    //         res.send(data);
    //     } else {
    //         console.log(err);
    //         res.send(err);
    //     }
    // })
    db.query("SELECT \
        summary.summary_data.idx, \
        summary.summary_data.id, \
        summary.summary_data.email, \
        summary.account_info.name, \
        summary.summary_data.time, \
        summary.summary_data.original_data, \
        summary.summary_data.summarize, \
        (SELECT COUNT(*) FROM summary.like_log WHERE summary_data_idx = summary.summary_data.idx)  AS 'like', \
        (SELECT IF(summary.summary_data.idx = summary_data_idx, 1, NULL) FROM summary.like_log WHERE email = 'tkarlz5@naver.com' AND summary_data_idx = summary.summary_data.idx)  AS 'clicked',\
        summary.account_info.image \
        FROM \
        summary.summary_data \
        LEFT JOIN \
        summary.account_info \
        ON (summary.summary_data.email = summary.account_info.email) OR (summary.summary_data.id = summary.account_info.id) \
        WHERE remove = 0 AND summary.summary_data.idx <= "+ req.body.idx +" \
        ORDER BY summary.summary_data.idx DESC LIMIT 10", (err, data) => {
        if(!err) {
            res.send(data);
        } else {
            console.log(err);
            res.send(err);
        }
    })
})

// 기록 추천순으로 가져오기
router.get('/recommend', (req, res) => {
    db.query("SELECT * FROM summary.summary_data ORDER BY `like` DESC LIMIT 100;", (err, data) => {
        if(!err) {
            res.send(data);
        } else {
            console.log(err);
            res.send(err);
        }
    })
})

// 좋아요
router.post('/like', (req, res) => {
    db.query("UPDATE `summary`.`summary_data` SET `like` =`like` + "+ req.body.sign +" WHERE (`idx` = "+ req.body.idx +")", (err, data) => {
        if(!err) {
            res.send(data);
        } else {
            console.log(err);
            res.send(err);
        }
    })
})

module.exports = router;