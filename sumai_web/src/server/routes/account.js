const express = require('express');
const mysql = require('mysql');
const AWS = require('aws-sdk');
const crypto = require('crypto');
const multer = require("multer");
const multerS3 = require('multer-s3');
var fs = require('fs');
const dbconfig   = require('../security/database');
const hashing = require('../security/hashing');
const s3config  = require('../security/s3config');

const db = mysql.createPool(dbconfig)
const router = express.Router();

const s3 = new AWS.S3(s3config);

const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: "sumai-profile",
      contentType: (req, file, cb) => {
        cb(null, "image/jpg")
      },
      key: (req, file, cb) => {
        cb(null, "image/" + crypto.createHash('sha1').update(req.params.email+Date.now()).digest("base64") + ".jpg")
      },
      acl: 'public-read',
    }),
    limits: { fileSize: 5 * 1024 * 1024 }
  })

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
        } else if (account[0].password === null) {
            return res.status(400).json({
                error: account[0].type + " 로그인으로 가입된 계정입니다.",
                code: account[0].type
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
            req.session.loginInfo = {
                ...req.session.loginInfo,
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

router.post('/imageUpload/:email', upload.single("img"), (req, res, next) => {
    db.query("SELECT * FROM summary.account_info WHERE email = '"+ req.params.email + "'", (err, account) => {
        if (account[0].image === null) {

        } else {
            const params = {
                Bucket: 'sumai-profile', 
                Delete: { 
                Objects: [ // required
                    {
                    Key: 'image/'+decodeURIComponent(account[0].image) // required
                    },
                ],
                },
            };
            s3.deleteObjects(params, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else     console.log(data);           // successful response
            });
        }
    });
    console.log(req.file)
    db.query("UPDATE summary.account_info SET image = '"+ req.file.location.substring(60, req.file.location.length) + "'  WHERE email = '"+ req.params.email + "'", (err, account) => {
        if (err) {
            console.log(err);
            return res.send(err);
        } else {
            return res.json({ image: req.file.location });
        }
    });
})

router.get('/imageLoad/:email', (req, res, next) => {
    db.query("SELECT * FROM summary.account_info WHERE email = '"+ req.params.email + "'", (err, account) => {
        if (err || account.length === 0) {
            console.log(err);
            return res.send(err);
        } else if (account[0].image === null) {
            return res.json({ image: '' });
        } else {
            return res.json({ image: 'https://sumai-profile.s3.ap-northeast-2.amazonaws.com/image/'+account[0].image })
        }
    });
})
 
module.exports = router;
