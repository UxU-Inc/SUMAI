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

const cryptoRandomString = require('crypto-random-string')
const ActionLog = require('../function/ActionLog')
const getRandomValues = require('get-random-values')

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


router.post("/temporary/send", function(req, res){
  const email=req.body.email
  const cert = cryptoRandomString({length: 20, type: 'url-safe'})
  req.session.password2email = {
    email: email,
    cert: cert,
    expires: parseInt(Date.now()/1000+1800)
  }
  console.log(cert)
  console.log(`http://localhost/email/login/login?id=${req.sessionID}&cert=${cert}`)
  ActionLog(req, `[S]send email password. email: ${email}`)
  return req.session.save(()=> {
    res.send(200)
    
  })
  // const message = `${cert}`
  // let mailOptions = {
  //   to: 'uxu.co.kr@gmail.com' , // 수신 메일 주소
  //   subject: `비밀번호 변경 확인 이메일입니다.`,   // 제목
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

router.post("/sendEmailCertification", function(req, res){
  const email=req.body.email
  const name = req.body.name
  const password = req.body.password // 이것도 위험한듯?
  const cert = cryptoRandomString({length: 10, type: 'url-safe'})

  if(!/^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[`~!@#$%^&+*()\-_+=.,<>/?'";:[\]{}\\|]).*$/.test(password)) {
    return res.json({ code: 2, message: '비밀번호가 양식에 맞지 않습니다.'});
  }else if(!/^[a-zA-Z가-힣0-9]{2,10}$/.test(name)) {
    return res.json({ code: 2, message: '이름이 형식에 맞지 않습니다.'})
  }else if(!/^[0-9a-z]([-_.]?[0-9a-z])*@[0-9a-z]([-_.]?[0-9a-z])*\.[a-z]{2,}$/i.test(email)) {
    return res.json({ code: 2, message: '이메일이 형식에 맞지 않습니다.'})
  }

  req.session.emailCert = {
    email: email,
    name: name,
    password: password, // 좀 위험한듯
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
          res.send({code: 1, message: '이메일 전송에 실패했습니다.'})
        }
        else {
          console.log('Email sent: ' + info.response);
          res.json({code: 0})
        }
      });
    }
  )
})

router.post("/EmailCertification", function(req, res){
  const id = req.body.id
  const cert = req.body.cert
  console.log('테스트')
  if (id===undefined || cert===undefined) {
    return res.json({message: '이메일 인증에 실패했습니다.', code: 2})
  }
  sessionStore.get(id, (err, session)=> {
    if (session.emailCert === undefined) {
      return res.json({message: '이메일 인증에 실패했습니다.', code: 3})
    }
    const email = session.emailCert.email
    const name = session.emailCert.name
    const password = session.emailCert.password // 위험한듯
    const emailCert = session.emailCert.cert
    const certState = session.emailCert.certState
    if(certState && emailCert===cert) return res.json({message: '이미 이메일 인증이 완료되었습니다.', code: 5, email: email})
    if (email === undefined || emailCert === undefined) return res.json({message: '이메일 인증에 실패했습니다.', code: 4})
    if(emailCert === cert) {
      session.emailCert = {
        email: email,
        cert: cert,
        certState: true
      }
      return sessionStore.set(id, session, () => {
        db.query("SELECT * FROM summary.account_info WHERE email = '"+ email + "'", (err, data) => {
          if (err) {
              console.log(err);
              return res.send(err);
          } else if(data.length !== 0){
              return res.status(400).json({
                  message: "해당 이메일이 존재합니다.",
                  code: 5
              });
          }
          const id = getRandomValues(new Uint8Array(10)).join('').slice(-10)+String(Date.now()).slice(-10)
          hashing.encrypt(password).then(password => {
              db.query("INSERT INTO summary.account_info (type, id, email, name, password, salt) VALUES ('SUMAI', "+ id + ", LOWER('"+ email +"'), '"+ name +"', '"+ password.hashed +"', '"+ password.salt +"')", (err, exists) => {
                  if(!err) {
                      // 회원가입 로그
                      ActionLog(req, `[S]signup. id: ${id}`)
                      db.query("INSERT INTO summary.account_change (modifiedDate, changeData, email, name, password, salt) VALUES (now(), 'signup', '"+ email +"', '"+ name +"', '"+ password.hashed +"', '"+ password.salt +"')")
                        return res.json({message: '이메일 인증이 완료되었습니다.', code: 0, email: email})
                  } else {
                      console.log(err);
                      return res.json({code: 6});
                  }
              });
          })
        })
      })
    }else{
      return res.json({message: '이메일 인증에 실패했습니다.', code: 1, email: email})
    }
  })
})

router.post("/temporary/login/:state", function(req, res, next){
  const id = req.body.id
  const cert = req.body.cert
  ActionLog(req, `[T]change password for email.`)
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
      delete session.password2email
      return sessionStore.set(id, session, () => {
        res.json({message: '인증이 만료되었습니다.', code: 6})
      })
    } 
    if (email === undefined || cert === undefined) return res.json({message: '세션 상태가 이상합니다.', code: 4}) // 해킹당한듯
    if(cert === req.body.cert) {
      db.query("SELECT * FROM summary.account_info WHERE email = '"+ email + "'", (err, account) => {
        if(!err) {
          if(account.length !== 1) {
            console.log('해킹당한듯?')
          }
          if(req.params.state === 'check'){
            return res.json({message: '인증 성공', code: 0, email: email})
          }else if(req.params.state === 'change') {
            next()
          }
        } else {
          console.log(err)
          return res.json({message: '쿼리 오류', code: 7})
        }
      })
    }else{
      console.log()
      return res.json({message: '잘못된 인증입니다.', code: 1})
    }
  })
})

router.post("/temporary/login/:state", function(req, res) {
  const id = req.body.id
  const password = req.body.password
  if(!/^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[`~!@#$%^&+*()\-_+=.,<>/?'";:[\]{}\\|]).*$/.test(password)) {
    return res.json({ code: 9, message: '변경할 비밀번호가 양식에 맞지 않습니다.'});
  }
  sessionStore.get(id, (err, session)=> {
    const email = session.password2email.email
    hashing.encrypt(password).then(password => {
      db.query("UPDATE summary.account_info SET password = '"+ password.hashed +"', salt = '"+ password.salt +"' WHERE email = '"+ email + "'", (err, exists) => {
          if(!err) {
              // 계정 변경 사항 account_change [password]
              db.query("SELECT * FROM summary.account_info WHERE email = '"+ email + "'", (err, account) => {
                db.query("INSERT INTO summary.account_change (modifiedDate, changeData, type, id, email, password, salt) VALUES (now(), 'findPassword', '"
                + account[0].type +"', '"+ account[0].id + "', '"+ account[0].email + "', '"+ password.hashed + "', '"+ password.salt + "')")
              delete session.password2email
              return sessionStore.set(id, session, () => {
                ActionLog(req, `[S]change password for email. id: ${account[0].id}`)
                res.json({ code: 0, message: '비밀번호가 변경되었습니다.' });
              })
            });
          } else {
              console.log(err);
              return res.json({ code: 8, message: '죄송합니다. 잠시후 다시 시도해주세요.'});
          }
      });
    })
  })
})


module.exports = router;