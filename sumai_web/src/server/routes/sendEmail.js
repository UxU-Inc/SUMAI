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
      const message = `http://localhost/EmailCertification?id=${req.sessionID}&cert=${cert}`
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

router.get("/emailtest/:email", function(req, res) {
  console.log(req.params.email)
})

router.post("/EmailCertification", function(req, res){
  const id = req.body.id
  const cert = req.body.cert
  if (id===undefined || cert===undefined) {
    return res.json({message: '주소가 잘못된듯', code: 2})
  }
  sessionStore.get(id, (err, session)=> {
    if (session.emailCert === undefined) {
      return res.json({message: '인증상태가 아니넹', code: 3})
    }
    const email = session.emailCert.email
    const emailCert = session.emailCert.cert
    const certState = session.emailCert.certState
    if(certState) return res.json({message: '이미 성공한 인증인듯', code: 5})
    if (email === undefined || emailCert === undefined) return res.json({message: '인증상태가 이상한듯', code: 4})
    if(emailCert === req.body.cert) {
      session.emailCert = {
        email: email,
        cert: emailCert,
        certState: true
      }
      return sessionStore.set(id, session, () => {
        return res.json({message: '인증 성공한듯', code: 0})
      })
    }else{
      return res.json({message: '인증 실패한듯', code: 1})
    }
  })
})

router.get("/temporary/login", function(req, res){
  const id = req.body.id
  const tempPassword = req.body.tempPassword
  if (id===undefined || cert===undefined) {0
    return res.json({message: '경로가 잘못되었습니다.', code: 2})
  }
  sessionStore.get(id, (err, session)=> {
    if (session.emailLogin === undefined) {
      return res.json({message: '이메일 로그인 상태가 아닙니다.', code: 3})
    }
    const email = session.emailLogin.email
    const tempPassword = session.emailLogin.tempPassword
    const expires = session.emailLogin.expires
    if (email === undefined || tempPassword === undefined) return res.json({message: '세션 상태가 이상합니다.', code: 4})
    if(tempPassword === req.body.tempPassword) {
      session.emailLogin = {
        email: email,
        cert: emailLogin,
        certState: true
      }
      return sessionStore.set(id, session, () => {
        return res.json({message: '인증 성공한듯', code: 0})
      })
    }else{
      return res.json({message: '인증 실패한듯', code: 1})
    }
  })
  
})

router.get('/temporary/wait', function(req, res) {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",

    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
    "Origin, X-Requested-With, Content-Type, Accept",
  })
  setInterval(() => {
    res.write(`data: ${JSON.stringify('hi')}\n\n`)
    console.log(req.locals.hello)
  }, 3000)
})

router.post("/temporary/send", function(req, res){
  // UPDATE `summary`.`action_log` SET `ipv4` = '123', `sns_type` = '123' WHERE (`index` = '2191');
  const email=req.body.email
  const tempPassword = Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2)
  req.session.emailLogin = {
    email: email,
    tempPassword: tempPassword,
    expires: Date.now()/1000+1800
  }
  // hashing.encrypt(tempPassword).then(password => {
  //   db.query(`UPDATE summary.account_info SET \`password\` = '${password.hashed}', \`salt\` = '${password.salt}' WHERE (\`email\` = '${req.body.email}')`, (err, exists) => {
  //       if(!err) {
  //           return res.json({ success: true });
  //       } else {
  //           console.log(err);
  //           return res.send(err);
  //       }
  //   });
  // }).catch( (error) => {
  //   console.log(error)
  // })
  console.log(tempPassword)
  // const message = `${tempPassword}`
  // let mailOptions = {
  //   to: 'uxu.co.kr@gmail.com' , // 수신 메일 주소
  //   subject: `임시 비밀번호`,   // 제목
  //   text: message,  // 내용
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