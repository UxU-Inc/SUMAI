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
                        res.json({ success: true, email: account[0].email, name: account[0].name }); 
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

router.post('/nameChange', (req, res) => {
    // 기존에 존재하는 email 이 있는지 DB 에서 확인
    db.query("UPDATE summary.account_info SET name = '"+ req.body.name + "'  WHERE email = '"+ req.body.email + "'", (err, account) => {
        console.log(account)
        if (err) {
            console.log(err);
            return res.send(err);
        } else {
            // 계정 변경 사항 account_change [name]
            db.query("SELECT * FROM summary.account_info WHERE email = '"+ req.body.email + "'", (err, account) => {
                db.query("INSERT INTO summary.account_change (modifiedDate, changeData, type, id, email, name) VALUES (now(), 'name', IF('"
                + account[0].type +"'='null', NULL, '"+ account[0].type + "'), IF('"+ account[0].id + "'='null', NULL, '"+ account[0].id + "'), '"+ account[0].email + "', '"+ req.body.name + "')")
            });
            req.session.loginInfo = {
                email: req.body.email,
                name: req.body.name,
            };
            return req.session.save(() => {
                res.json({ success: true });
            })
        }
    });
})

router.post('/passwordChange', (req, res) => {

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
            // 현재 비밀번호 확인
            hashing.confirm(req.body.passwordCurrent, account[0].salt).then(password => {
                if(account[0].password === password.hashed) {
                    // 변경할 비밀번호 hashing
                    hashing.encrypt(req.body.passwordChange).then(password => {
                        db.query("UPDATE summary.account_info SET password = '"+ password.hashed +"', salt = '"+ password.salt +"' WHERE email = '"+ req.body.email + "'", (err, exists) => {
                            if(!err) {
                                // 계정 변경 사항 account_change [password]
                                db.query("SELECT * FROM summary.account_info WHERE email = '"+ req.body.email + "'", (err, account) => {
                                    db.query("INSERT INTO summary.account_change (modifiedDate, changeData, type, id, email, password, salt) VALUES (now(), 'password', IF('"
                                    + account[0].type +"'='null', NULL, '"+ account[0].type + "'), IF('"+ account[0].id + "'='null', NULL, '"+ account[0].id + "'), '"+ account[0].email + "', '"+ password.hashed +"', '"+ password.salt + "')")
                                });
                                return res.json({ success: true });
                            } else {
                                console.log(err);
                                return res.send(err);
                            }
                        });
                    })
                } else {
                    return res.status(400).json({
                        error: "현재 비밀번호가 틀립니다.",
                        code: 3
                    });
                }
            })  
        }
        
    });

})

router.post('/withdrawal', (req, res) => {

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
            // 현재 비밀번호 확인
            hashing.confirm(req.body.password, account[0].salt).then(password => {
                if(account[0].password === password.hashed) {
                    // 계정, 해당 계정 관련 데이터 제거
                    db.query("DELETE FROM summary.account_info WHERE email = '"+ req.body.email + "'", (err, exists) => {
                        if(!err) {
                            // 추후 summary_data 테이블 데이터도 삭제, summary_data에 email 컬럼 추가
                            return res.json({ success: true });
                        } else {
                            console.log(err);
                            return res.send(err);
                        }
                    });
                } else {
                    return res.status(400).json({
                        error: "현재 비밀번호가 틀립니다.",
                        code: 3
                    });
                }
            })  
        }
        
    });

})

router.post('/birthdayChange', (req, res) => {
    // 기존에 존재하는 email 이 있는지 DB 에서 확인
    db.query("UPDATE summary.account_info SET birth = '"+ req.body.birthday + "'  WHERE email = '"+ req.body.email + "'", (err, account) => {
        console.log(account)
        if (err) {
            console.log(err);
            return res.send(err);
        } else {
            // 계정 변경 사항 account_change [name]
            db.query("SELECT * FROM summary.account_info WHERE email = '"+ req.body.email + "'", (err, account) => {
                db.query("INSERT INTO summary.account_change (modifiedDate, changeData, type, id, email, birth) VALUES (now(), 'birth', IF('"
                + account[0].type +"'='null', NULL, '"+ account[0].type + "'), IF('"+ account[0].id + "'='null', NULL, '"+ account[0].id + "'), '"+ account[0].email + "', '"+ req.body.birthday + "')")
            });
            return req.session.save(() => {
                res.json({ success: true });
            })
        }
    });
})
 
module.exports = router;
