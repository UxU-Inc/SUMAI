const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post("/sendEmail", function(req, res, next){
  let message = req.body.message;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'uxu.co.kr@gmail.com',  // gmail 계정 아이디를 입력
      pass: 'wjtmxmendlt!UXU'          // gmail 계정의 비밀번호를 입력
    }
  });

  let mailOptions = {
    from: 'uxu.co.kr@gmail.com',    // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
    to: 'uxu.co.kr@gmail.com' ,                     // 수신 메일 주소
    subject: 'nodemailer test',   // 제목
    text: message  // 내용
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    }
    else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.redirect("/");
})

module.exports = router;