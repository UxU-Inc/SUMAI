const express = require('express');
const mysql = require('mysql');

const dbconfig = require('../security/database');
const hashing = require('../security/hashing');
const db = mysql.createPool(dbconfig)

const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session);
const sessionStore = new MySQLStore(dbconfig);

const nodemailer = require('nodemailer');
const gmailOAuth2Data   = require('../security/gmailOAuth2');
const transporter = nodemailer.createTransport(gmailOAuth2Data);

const router = express.Router();

router.post("/sendEmail", function(req, res){
  let email = req.body.email;
  let message = req.body.message;
  let src = req.body.src;

  let mailOptions = {
    to: 'uxu.co.kr@gmail.com' ,                     // 수신 메일 주소
    subject: `의견 보내기 ${''}`,   // 제목
    text: message,  // 내용
    // html: 'Embedded image: <img src="cid:feedbackImage"/>',
    // attachments: [{
    //   filename: 'feedback.png',
    //   path: src,
    //   cid: 'feedbackImage'
    // }]
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.status(500).send()
    }
    else {
      console.log('Email sent: ' + info.response);
      res.status(200).send()
    }
  });

})

router.post("/sendEmailCertification", function(req, res){
  const email=req.body.email
  const cert = Math.random().toString(36).slice(2)

  req.session.emailCert = {
    email: email,
    cert: cert,
    certState: false
  }
  req.session.save(
    () => {
      const message = `http://localhost/email/certification?id=${req.sessionID}&cert=${cert}` // 주소 함수를 이용해서 받아야 할 듯
      let mailOptions = {
        to: 'uxu.co.kr@gmail.com' , // 수신 메일 주소
        subject: `이메일 인증`,   // 제목
        text: message,  // 내용
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          res.status(500).send()
        }
        else {
          console.log('Email sent: ' + info.response);
          res.status(200).send()
        }
      });
    }
  )

  
})

router.post("/EmailCertification", function(req, res){
  const id = req.body.id
  const cert = req.body.cert
  if (id===undefined || cert===undefined) {
    return res.json({message: '이메일 인증에 실패했습니다.', code: 2})
  }
  sessionStore.get(id, (err, session)=> {
    if (session.emailCert === undefined) {
      return res.json({message: '이메일 인증에 실패했습니다.', code: 3})
    }
    const email = session.emailCert.email
    const emailCert = session.emailCert.cert
    const certState = session.emailCert.certState
    if(certState) return res.json({message: '이미 이메일 인증이 완료되었습니다.', code: 5, email: email})
    if (email === undefined || emailCert === undefined) return res.json({message: '이메일 인증에 실패했습니다.', code: 4})
    if(emailCert === req.body.cert) {
      session.emailCert = {
        email: email,
        cert: emailCert,
        certState: true
      }
      return sessionStore.set(id, session, () => {
        return res.json({message: '이메일 인증이 완료되었습니다.', code: 0, email: email})
      })
    }else{
      return res.json({message: '이메일 인증에 실패했습니다.', code: 1, email: email})
    }
  })
})

router.post("/temporary/login", function(req, res){
  const id = req.body.id
  const cert = req.body.cert
  if (id===undefined || cert===undefined) {0
    return res.json({message: '경로가 잘못되었습니다.', code: 2})
  }
  sessionStore.get(id, (err, session)=> {
    if (session.password2email === undefined) {
      return res.json({message: '이메일 로그인 상태가 아닙니다.', code: 3})
    }
    const email = session.password2email.email
    const cert = session.password2email.cert
    const expires = session.password2email.expires
    if (expires === undefined || expires < parseInt(Date.now()/1000)) {
      session.password2email = {expires: 0}
      return sessionStore.set(id, session, () => {
        res.json({message: '인증이 만료되었습니다.', code: 6})
      })
    } 
    if (email === undefined || cert === undefined) return res.json({message: '세션 상태가 이상합니다.', code: 4})
    if(cert === req.body.cert) {
      db.query("SELECT * FROM summary.account_info WHERE email = '"+ email + "'", (err, account) => {
        if(!err) {
          if(account.length !== 1) {
            console.log('해킹당한듯?')
          }
          res.json({message: '인증 성공', code: 0})
        } else {
          console.log(err)
          return res.json({message: '쿼리 오류', code: 7})
        }
      })
    }else{
      console.log()
      return res.json({message: '인증 실패한듯', code: 1})
    }
  })
})

router.post("/temporary/login/change", function(req, res) {
  // 미들웨어로 /temporary/login/에서 함 더 검증해야할 듯
  const password = req.body.password
  hashing.encrypt(password).then(password => {
    db.query("UPDATE summary.account_info SET password = '"+ password.hashed +"', salt = '"+ password.salt +"' WHERE email = '"+ req.body.email + "'", (err, exists) => {
        if(!err) {
            // 계정 변경 사항 account_change [password]
            // db.query("SELECT * FROM summary.account_info WHERE email = '"+ req.body.email + "'", (err, account) => {
            //     db.query("INSERT INTO summary.account_change (modifiedDate, changeData, type, id, email, password, salt) VALUES (now(), 'password', IF('"
            //     + account[0].type +"'='null', NULL, '"+ account[0].type + "'), IF('"+ account[0].id + "'='null', NULL, '"+ account[0].id + "'), '"+ account[0].email + "', '"+ password.hashed +"', '"+ password.salt + "')")
            // });
            return res.json({ code: 0, message: '비밀번호가 변경되었습니다.' });
        } else {
            console.log(err);
            return res.json({ code: 8, message: '죄송합니다. 잠시후 다시 시도해주세요.'});
        }
    });
})
})

router.post("/temporary/send", function(req, res){
  // UPDATE `summary`.`action_log` SET `ipv4` = '123', `sns_type` = '123' WHERE (`index` = '2191');
  const email=req.body.email
  const cert = Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2)
  req.session.password2email = {
    email: email,
    cert: cert,
    expires: parseInt(Date.now()/1000+1800)
  }
  console.log(cert)
  console.log(`http://localhost/email/login/login?id=${req.sessionID}&cert=${cert}`)
  return req.session.save(()=> {
    res.send(200)
    
  })
  // const message = `${cert}`
  // let mailOptions = {
  //   to: 'uxu.co.kr@gmail.com' , // 수신 메일 주소
  //   subject: `임시 비밀번호`,   // 제목
  //   text: `http://localhost/email/login/login?id=${req.sessionID}&cert=${cert}`,  // 내용
  // };

  // transporter.sendMail(mailOptions, function(error, info){
  //   if (error) {
  //     console.log(error);
  //     res.status(500).send()
  //   }
  //   else {
  //     console.log('Email sent: ' + info.response);
  //     res.status(200).send()
  //   }
  // });
})

module.exports = router;