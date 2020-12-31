const express = require('express');
const axios = require('axios')
const https = require('https')

const router = express.Router();

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
})

router.post("/request", function(req, res){
  let summarize = req.body.summarize;
  let id = req.body.id;
  let record = req.body.record;


  axios.post('https://api.sumai.co.kr/summary', {
    summarize: summarize,
    id: id,
    record: record,
  }, {
    httpsAgent: httpsAgent,
  })
  .then(data => {
    // console.log(`statusCode: ${res.data.summarize}`)
    // console.log(res)
    res.status(200).send(data.data)
  })
  .catch(error => {
    console.error(error)
    res.status(500).send()
  })
})

module.exports = router;