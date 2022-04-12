const express = require('express')
const cors = require('cors')
const logger = require('./utils/logger')
const { datadogDataInsight, datadogDataError, datadogDataApp2 } = require('./utils/datadogData')
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
    datadogDataApp2(req.body.url,req.get('user-agent'))
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





