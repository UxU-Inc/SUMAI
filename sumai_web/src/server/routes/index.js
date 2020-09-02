const express = require('express');
const account = require('./account');
const record = require('./record');
const notices = require('./notices');
const snslogin = require('./snslogin');
const email = require('./email')
const recordLog = require('./recordLog')

const router = express.Router();
 
// 계정 관련
router.use('/account', account);
// 요약 기록 관련
router.use('/record', record);
// 공지 관련
router.use('/notices', notices);
// SNS로그인 관련
router.use('/snslogin', snslogin);

// 이메일 관련
router.use('/email', email);
// 로그 관련
router.use('/recordLog', recordLog);
 
module.exports = router;