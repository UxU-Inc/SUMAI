const express = require('express');
const mysql = require('mysql');
const dbconfig   = require('../security/database');
const hashing = require('../security/hashing');

const db = mysql.createPool(dbconfig)
const router = express.Router();

router.post('/signup', (req, res) => {
    // 기존에 존재하는 email 이 있는지 DB 에서 확인
    db.query("SELECT * FROM summary.account_info WHERE email = '"+ req.body.email + "'", (err, data) => {
        if (err) {
            console.log(err);
            return res.send(err);
        } else if(data.length !== 0){
            return res.status(400).json({
                error: "해당 이메일이 존재합니다.",
                code: 1
            });
        }
        // CREATE ACCOUNT
        // hash 를 이용해 비밀번호 보안
        hashing.encrypt(req.body.password).then(password => {
            db.query("INSERT INTO summary.account_info (email, name, password, salt) VALUES ('"+ req.body.email +"', '"+ req.body.name +"', '"+ password.hashed +"', '"+ password.salt +"')", (err, exists) => {
                if(!err) {
                    return res.json({ success: true });
                } else {
                    console.log(err);
                    return res.send(err);
                }
            });
        })   
    });
})

router.post('/login', (req, res) => {
    // 기존에 존재하는 email 이 있는지 DB 에서 확인
    db.query("SELECT * FROM summary.account_info WHERE email = '"+ req.body.email + "'", (err, account) => {
        if (err) {
            console.log(err);
            return res.send(err);
        } else if(account.length === 0){
            return res.status(400).json({
                error: "해당 이메일로 가입되어 있지 않습니다.",
                code: 2
            })
        } else {
            // 비밀번호 확인
            hashing.confirm(req.body.password, account[0].salt).then(password => {
                if(account[0].password === password.hashed) {
                    req.session.loginInfo = {
                        email: account[0].email,
                        name: account[0].name
                    };
                    return req.session.save(() => {
                        res.json({ success: true });
                    })
                } else {
                    return res.status(400).json({
                        error: "비밀번호가 틀립니다.",
                        code: 3
                    });
                }
            })  
        }
        
    });
})

router.post('/logout', (req, res) => {
    delete req.session.loginInfo;
    return req.session.save(() => {
        res.json({ success: true });
    })
})

router.get('/getinfo', (req, res) => {
    console.log(req.session)
    if(typeof req.session.loginInfo === "undefined") {
        return res.status(401).json({
            error: "로그인 데이터가 없습니다.",
            code: 4
        });
    }
 
    return res.json({ info: req.session.loginInfo });
})
 
module.exports = router;
