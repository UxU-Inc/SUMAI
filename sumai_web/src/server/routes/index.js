const express = require('express');
const account = require('./account');
const record = require('./record');
const notices = require('./notices');
const sendEmail = require('./sendEmail')
const connectLog = require('./connectLog')

const router = express.Router();
 
// 계정 관련
router.use('/account', account);
// 요약 기록 관련
router.use('/record', record);
// 공지 관련
router.use('/notices', notices);
// 이메일 보내기 관련
router.use('/sendEmail', sendEmail);
// 이메일 보내기 관련
router.use('/connectLog', connectLog);
 
module.exports = router;
