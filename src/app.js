const express = require('express')
const cors = require('cors')
const logger = require('./utils/logger')
const { datadogDataInsight, datadogDataError } = require('./utils/datadogData')
const analyticsRequest = require('./service/analyticsRequest')
const {endpoint} = require('./const/constants')

const app = express()
app.use(express.json())
app.use(cors())

app.get(endpoint, (req,res) => {
    res.send("Logger")
})
//Approach 1
app.post('/logger', (req, res) => {
    let data = datadogDataInsight(req.body,req.get('user-agent'))
    logger.info(data)
    // analyticsRequest(req.body, req.headers)
    res.send({"Logged":"yes"})
}) 
//Approach 2(in-progress)
app.post('/logger/url', (req,res)=> {
    var url = req.body.url;
    let params = (new URL(url)).searchParams;
    if(params.get('r_batch')){
        var batch = params.get('r_batch').replace(/,/g, "&").replace(/:/g, "=");//setting r_batch in query param format to make later processing easier
        params.set('r_batch',batch)
        var batchUrl = params.get('r_batch').match(/\(([^()]*)\)/g).map(function($0) { return $0.substring(1,$0.length-1) })//extracting each event from batch
        console.log( new URLSearchParams(batchUrl[0]) )
    }
    res.send({"Logged":"yes"})
})

app.post('/error', (req, res) => {
    let data = datadogDataError(req.body)
    logger.error(data);
    res.send(data);
  })

app.listen(3000, () => {
    console.log('Listening on port 3000')
})





