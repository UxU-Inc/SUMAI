const express = require('express');
const nodemailer = require('nodemailer');
const gmailOAuth2Data   = require('../security/gmailOAuth2');
const router = express.Router();

router.post("/sendEmail", function(req, res){
  let transporter = nodemailer.createTransport(gmailOAuth2Data);
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

module.exports = router;