const express = require('express');
const axios = require('axios')
const https = require('https')
const mysql = require('mysql');
const dbconfig   = require('../security/database');
const moment = require('moment');
require('moment-timezone');

const db = mysql.createPool(dbconfig)
const router = express.Router();

moment.tz.setDefault("Asia/Seoul");

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
})

router.post("/request", function(req, res){
  var data = req.body.data;
  let id = req.body.id;
  var remove = req.body.record;
  let ip_addr = req.body.ip_addr;
  let time_str = moment().format('YYYY-MM-DD HH:mm:ss');
  data = data.trim().replace(/\'/gi, "\"")

  axios.post('https://api.sumai.co.kr/summary', {
    data: data,
  }, {
    httpsAgent: httpsAgent,
  })
  .then(result => {
    let summarize = result.data.summarize
    if(data === summarize) {
      res.status(200).send(result.data)
    } else {
      db.query(`INSERT INTO summary.summary_data (original_data, summarize, remove, id, time, ip_addr) \
        VALUES ('${data}', '${summarize}', ${!remove}, '${id}', '${time_str}', '${ip_addr}')`, (err, data) => {
        if(!err) {
            // console.log(`statusCode: ${res.data.summarize}`)
            // console.log(res)
            res.status(200).send(result.data)
        } else {
            console.log(err);
            res.status(500).send();
        }
      })
    }
  })
  .catch(error => {
    console.error(error)
    res.status(500).send()
  })
})

module.exports = router;