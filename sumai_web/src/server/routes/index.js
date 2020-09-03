const express = require('express');
const account = require('./account');
const record = require('./record');
const notices = require('./notices');
const snslogin = require('./snslogin');
const email = require('./email')
const recordLog = require('./recordLog')
const ActionLog = require('../function/ActionLog')

const router = express.Router();
 
router.use('/:where/:what', function (req, res, next){
    if(req.params.where === 'account') {
        if(req.params.what === 'login') {
            ActionLog(req, `[T]login. email: ${req.body.email}`)
        }else if(req.params.what === 'logout') {
            if(req.session.loginInfo !== null){
                ActionLog(req, `[S]logout`)
            }
        } 
    } else if(req.params.where === 'snslogin') {}
    // else if(req.params.where === 'email') {
    //     if(req.params.what === 'temporary') {
    //         if(req.params.param === 'send') {
    //             ActionLog.record(`send password email. email: ${req.body.email}`)
    //         }
    //     }
    // }
    next()
})

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